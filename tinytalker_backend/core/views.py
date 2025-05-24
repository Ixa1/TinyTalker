from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from rest_framework import viewsets, status, generics
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Sum
from .models import (
    Unit, UserProgress, UserProfile, LeaderboardEntry,
    Course, Lesson, Question, Report,DailyQuest, UserDailyQuest,
)
from .serializers import (
    UnitSerializer, UserProgressSerializer, LeaderboardSerializer,
    CourseSerializer, ProfileSerializer, QuestionSerializer, LessonSerializer, UserDailyQuestSerializer
)
@api_view(['GET'])
def leaderboard_view(request):
    # Aggregate total XP per user
    xp_by_user = UserProgress.objects.values('user_id').annotate(total_xp=Sum('xp')).order_by('-total_xp')
    data = [{"userId": item['user_id'], "xp": item['total_xp']} for item in xp_by_user]
    return Response(data)
# --------------------------
# AUTHENTICATION & SIGNUP
# --------------------------


class SignupView(APIView):
    def post(self, request):
        try:
            username = request.data.get("username")
            email = request.data.get("email")
            password = request.data.get("password")
            confirm_password = request.data.get("confirmPassword")

            if not username or not email or not password or not confirm_password:
                return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

            if password != confirm_password:
                return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

            if len(password) < 6:
                return Response({"error": "Password must be at least 6 characters."}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username=username).exists():
                return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already in use."}, status=status.HTTP_400_BAD_REQUEST)

            # ✅ Create user (inactive)
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_active=True
            )

            # ✅ Generate token and uid
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            activation_link = f"http://localhost:3000/api/auth/activate/{uid}/{token}/"

            send_mail(
                subject="Activate your Tiny Talker account",
                message=f"Hi {user.username}, please click the following link to activate your account:\n\n{activation_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            print("✅ Email sent to", email)
            return Response({"message": "User created successfully. Verification email sent."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("❌ Email sending failed:", str(e))
            raise APIException("Internal server error. Contact support.")

@api_view(['GET'])
def activate_user(request, uidb64, token):
    try:
        # Decode UID
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)

        # Check token validity
        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Account activated successfully!"}, status=200)
        else:
            return Response({"error": "Invalid or expired activation link."}, status=400)

    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
    except Exception as e:
        print("Activation error:", str(e))  # Log error in terminal
        return Response({"error": "Activation failed."}, status=400)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'username': self.user.username,
            'is_admin': self.user.is_staff or self.user.is_superuser
        }
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# --------------------------
# MODEL VIEWSETS (For CRUD)
# --------------------------

class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer


class CourseViewSet(viewsets.ReadOnlyModelViewSet):  # Only list & retrieve
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().order_by('order')
    serializer_class = LessonSerializer


class UserProgressViewSet(viewsets.ModelViewSet):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# --------------------------
# API VIEWS
# --------------------------
class LessonQuestionsView(generics.ListAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        lesson_id = self.request.query_params.get('lesson_id')
        return Question.objects.filter(lesson_id=lesson_id)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.userprofile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserProfile.objects.order_by('-total_xp')[:10]
    serializer_class = LeaderboardSerializer

class LessonListCreateView(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

# --------------------------
# CUSTOM LESSON APIs
# --------------------------

# ✅ Needed for LearnPage → Fetch lessons per course
@api_view(['GET'])
def get_lessons_by_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    lessons = Lesson.objects.filter(course=course).order_by('order')
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    profile = user.userprofile
    courses = profile.courses.all()

    data = {
        "name": user.first_name or user.username,
        "username": f"@{user.username}",
        "joined": user.date_joined.strftime("%d %B %Y"),
        "avatar": profile.avatar.url if profile.avatar else None,
        "stats": {
            "streak": profile.streak,
            "xp": profile.total_xp,
            "league": profile.league,
            "topFinishes": profile.top3_finishes,
        },
        "progress": [
            {"course": course.title, "percent": course.get_progress_for_user(user)}
            for course in courses
        ]
    }

    return Response(data)

# ✅ Used by LessonPage to update XP & completion
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_progress(request):
    user = request.user
    lesson_id = request.data.get('lessonId')
    xp = request.data.get('xp', 0)
    completed = request.data.get('completed', False)

    if not lesson_id:
        return Response({"error": "lessonId is required"}, status=400)

    try:
        lesson = Lesson.objects.get(id=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=404)

    progress, _ = UserProgress.objects.get_or_create(user_id=user.id, lesson=lesson)
    progress.xp = xp
    progress.completed = completed
    progress.save()

    return Response({"message": "Progress updated successfully!"})


# ✅ LessonPage → fetch questions
@api_view(['GET'])
def get_questions_by_lesson(request):
    lesson_id = request.query_params.get('lesson_id')
    if not lesson_id:
        return Response({"error": "lesson_id is required"}, status=400)

    questions = Question.objects.filter(lesson_id=lesson_id)
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])  # 🔥 Supports both GET and POST
def question_handler(request):
    if request.method == 'GET':
        lesson_id = request.query_params.get('lesson_id')
        if not lesson_id:
            return Response({"error": "lesson_id is required"}, status=400)
        questions = Question.objects.filter(lesson_id=lesson_id)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
@api_view(['DELETE'])
def delete_question_by_id(request, pk):
    try:
        question = Question.objects.get(pk=pk)
        question.delete()
        return Response({"message": "Deleted"})
    except Question.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request, question_id):
    try:
        question = Question.objects.get(id=question_id)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)

    answer = request.data.get("answer")
    profile = request.user.userprofile

    correct = False
    if answer.strip().lower() == question.answer.strip().lower():
        correct = True

    if correct:
        # ✅ Add XP
        profile.total_xp += 2

        # ✅ Refill heart if less than 5
        if profile.hearts < 5:
            profile.hearts += 1

    else:
        # ❌ Deduct 1 heart if answer is wrong
        if profile.hearts > 0:
            profile.hearts -= 1
        else:
            return Response({"error": "Out of hearts"}, status=400)

    profile.save()

    return Response({
        "correct": correct,
        "xp": profile.total_xp,
        "hearts": profile.hearts,
    })
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quest_answer(request, question_id):
    try:
        question = Question.objects.get(id=question_id)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)

    answer = request.data.get("answer")
    profile = request.user.userprofile
    now = timezone.now()
    today = now.date()

    correct = False
    if answer.strip().lower() == question.answer.strip().lower():
        correct = True

    if correct:
        profile.total_xp += 2

        # # ✅ HEART REFILL ONLY HERE
        # if profile.hearts < 5:
        #     profile.hearts += 1

        # ✅ Update quest progress (optional logic)
        # Example:
        # quest = UserDailyQuest.objects.filter(...).first()
        # if quest and not quest.completed:
        #     quest.progress += 1
        #     if quest.progress >= quest.target:
        #         quest.completed = True
        #     quest.save()

    else:
        if profile.hearts > 0:
            profile.hearts -= 1
        else:
            return Response({"error": "Out of hearts"}, status=400)

    profile.save()

    return Response({
        "correct": correct,
        "xp": profile.total_xp,
        "hearts": profile.hearts,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_xp_summary(request):
    total_xp = UserProgress.objects.filter(user=request.user).aggregate(total=models.Sum('xp'))['total'] or 0
    return Response({"total_xp": total_xp})
# ✅ Admin Dashboard Summary
@api_view(['GET'])
def admin_summary(request):
    try:
        users = get_user_model().objects.count()
        lessons = Lesson.objects.count()
        questions = LessonQuestion.objects.count()
        reports = Report.objects.count()

        return Response({
            "users": users,
            "lessons": lessons,
            "questions": questions,
            "reports": reports
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ✅ Admin user list
@api_view(['GET'])
def admin_user_list(request):
    users = User.objects.all().values('id', 'username', 'email', 'is_active')
    data = [{
        "id": u['id'],
        "name": u['username'],
        "email": u['email'],
        "status": "active" if u['is_active'] else "pending"
    } for u in users]
    return Response(data)

@api_view(['GET'])
def user_progress_list(request):
    progress = UserProgress.objects.all()
    serializer = UserProgressSerializer(progress, many=True)
    return Response(serializer.data)

# ✅ Admin distribution chart data
@api_view(['GET'])
def user_course_distribution(request):
    data = {course.name: course.userstats_set.count() for course in Course.objects.all()}
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_user_course(request):
    course_id = request.data.get('course_id')
    if not course_id:
        return Response({'error': 'course_id is required'}, status=400)

    try:
        course = Course.objects.get(id=course_id)
        profile = request.user.userprofile
        profile.selected_course = course
        profile.save()
        return Response({'message': 'Course selected successfully'})
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)

# ✅ Admin add new question
@api_view(['POST'])
def create_question(request):
    serializer = QuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# ✅ Health check
def root_view(request):
    return JsonResponse({"message": "API running"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_quests(request):
    today = timezone.now().date()
    user = request.user

    # Auto-assign 3 random quests daily
    if not UserDailyQuest.objects.filter(user=user, date_assigned=today).exists():
        quests = DailyQuest.objects.order_by('?')[:3]
        for q in quests:
            try:
                UserDailyQuest.objects.create(user=user, quest=q)
            except IntegrityError:
                continue  # Avoid duplicates

    user_quests = UserDailyQuest.objects.filter(user=user, date_assigned=today)
    serializer = UserDailyQuestSerializer(user_quests, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_quest_progress(request, quest_id):
    try:
        uq = UserDailyQuest.objects.get(id=quest_id, user=request.user)
    except UserDailyQuest.DoesNotExist:
        return Response({'error': 'Quest not found'}, status=404)

    if not uq.completed:
        uq.progress += 1
        if uq.progress >= uq.quest.target:
            uq.completed = True
            # You can add reward XP to profile here if needed:
            profile = request.user.userprofile
            profile.total_xp += uq.quest.reward_xp
            profile.save()
        uq.save()

    serializer = UserDailyQuestSerializer(uq)
    return Response(serializer.data)