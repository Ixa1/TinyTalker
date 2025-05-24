from rest_framework import serializers
from .models import Unit, UserProgress, UserProfile, Course, Lesson, Question, LeaderboardEntry,DailyQuest, UserDailyQuest
from django.contrib.auth.models import User

# ✅ Serializer for Unit Model
class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'


# ✅ Serializer for tracking user's progress in lessons
class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['id', 'unit', 'lesson', 'xp', 'completed']


# ✅ Serializer for displaying user profile info
class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='profile.avatar', required=False)
    courses = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'first_name', 'date_joined', 'avatar', 'courses']

    def update(self, instance, validated_data):
        user_profile_data = validated_data.pop('profile', {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        profile, _ = UserProfile.objects.get_or_create(user=instance)
        avatar = user_profile_data.get('avatar')
        if avatar:
            profile.avatar = avatar
            profile.save()
        return instance
    
    def get_courses(self, obj):
        profile = getattr(obj, 'profile', None)
        if profile and profile.courses.exists():
            return [
                {
                    'title': course.title,
                    'icon': course.icon.url if course.icon else None
                }
                for course in profile.courses.all()
            ]
        return []

# ✅ Serializer for leaderboard view
class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'total_xp', 'avatar']

    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar and hasattr(obj.avatar, 'url'):
            return request.build_absolute_uri(obj.avatar.url)
        return None
class DailyQuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyQuest
        fields = '__all__'

class UserDailyQuestSerializer(serializers.ModelSerializer):
    quest_title = serializers.CharField(source='quest.title', read_only=True)
    quest_type = serializers.CharField(source='quest.type', read_only=True)
    target = serializers.IntegerField(source='quest.target', read_only=True)
    reward_xp = serializers.IntegerField(source='quest.reward_xp', read_only=True)

    class Meta:
        model = UserDailyQuest
        fields = ['id', 'quest_title', 'quest_type', 'target', 'progress', 'completed', 'reward_xp']

# ✅ Serializer for question (used in LessonPage)
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'lesson', 'question_text', 'options', 'answer']



# ✅ Serializer for lessons, with nested course name and question count
class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    total_xp = serializers.IntegerField()  
    class Meta:
        model = LeaderboardEntry
        fields = ['username', 'total_xp', 'avatar']

    def get_username(self, obj):
        return obj.user.username or f"User {obj.user.id}"
    def get_avatar(self, obj):
        profile = getattr(obj.user, 'userprofile', None)
        if profile and profile.avatar:
            request = self.context.get('request')
            return request.build_absolute_uri(profile.avatar.url)
        return None
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'order']


# ✅ Serializer for courses with nested lessons
class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'icon', 'lessons']
