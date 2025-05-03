from rest_framework import serializers
from .models import Unit, UserProgress
from .models import UserProfile, Course, Lesson
from .models import LeaderboardEntry
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['id', 'unit', 'xp', 'completed']  # 
class ProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.first_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['name', 'username', 'email', 'date_joined', 'streak', 'total_xp', 'league', 'top3_finishes', 'profile_picture']

class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')

    class Meta:
        model = LeaderboardEntry
        fields = ['username', 'total_xp', 'rank']
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'xp', 'section', 'order']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'icon', 'lessons']