from rest_framework import viewsets
from .models import Unit, UserProgress, UserProfile, LeaderboardEntry, Course, Lesson, UserProgress
from .serializers import UnitSerializer, UserProgressSerializer, LeaderboardSerializer, CourseSerializer, LessonSerializer, ProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.generics import ListAPIView
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from core.models import Lesson, LessonQuestion, Report 

class SignupView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        confirm_password = request.data.get("confirmPassword")

        # Validate required fields
        if not username or not email or not password or not confirm_password:
            return Response(
                {"error": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Password match check
        if password != confirm_password:
            return Response(
                {"error": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check password strength (optional)
        if len(password) < 6:
            return Response(
                {"error": "Password must be at least 6 characters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent duplicate usernames
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent duplicate emails
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already in use."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )

        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )


        return Response(data) 
class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

class UserProgressViewSet(viewsets.ModelViewSet):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]  # 🔒 Only logged-in users

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.userprofile  # Assumes OneToOneField to User
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

class LeaderboardView(ListAPIView):
    queryset = LeaderboardEntry.objects.order_by('-total_xp')
    serializer_class = LeaderboardSerializer

    def leaderboard_data(request):
        data = {"message": "Hello from leaderboard"}
        return Response(data)
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all().order_by('order')
    serializer_class = LessonSerializer

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

from django.http import JsonResponse

def root_view(request):
    return JsonResponse({"message": "API running"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_progress(request):
    user = request.user
    lesson_id = request.data.get('lessonId')
    xp = request.data.get('xp', 0)
    completed = request.data.get('completed', False)

    if not lesson_id:
        return Response({"error": "lessonId is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        lesson = Lesson.objects.get(id=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

    progress, created = UserProgress.objects.get_or_create(user_id=user.id, lesson=lesson)
    progress.xp = xp
    progress.completed = completed
    progress.save()

    return Response({"message": "Progress updated successfully!"})

@api_view(['GET'])
def admin_summary(request):
    try:
        User = get_user_model()
        users_count = User.objects.count()
        lessons_count = Lesson.objects.count()
        questions_count = LessonQuestion.objects.count()
        reports_count = Report.objects.count()

        return Response({
            "users": users_count,
            "lessons": lessons_count,
            "questions": questions_count,
            "reports": reports_count
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)