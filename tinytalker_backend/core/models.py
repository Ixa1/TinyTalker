from django.db import models
from django.contrib.auth.models import User

# Course Model
class Course(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to='course_icons/', null=True, blank=True)  # colorful icon for each course

    def __str__(self):
        return self.name

# Lesson Model
class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)  # lesson order inside course
    xp = models.PositiveIntegerField(default=10)  # XP rewarded for completing
    section = models.CharField(max_length=255, blank=True)  # optional grouping like "Basics 1", "Basics 2"

    def __str__(self):
        return f"{self.course.name} - {self.title}"

# Questions per Lesson
class LessonQuestion(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='questions')
    question = models.CharField(max_length=255)
    option1 = models.CharField(max_length=100)
    option2 = models.CharField(max_length=100)
    option3 = models.CharField(max_length=100)
    option4 = models.CharField(max_length=100)
    answer = models.CharField(max_length=100)  # correct option text

    def __str__(self):
        return f"Q: {self.question} (Lesson: {self.lesson.title})"

# Unit Model (optional if grouping lessons together)
class Unit(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    language = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.language} - {self.title}"

# Track Progress per User per Lesson
class UserProgress(models.Model):
    user_id = models.CharField(max_length=255)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, blank=True)  # ✅ Add null=True, blank=True
    xp = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} - XP: {self.xp_earned}"

# User Profile to Track Total XP, League, Streak, Profile Picture
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    streak = models.PositiveIntegerField(default=0)
    total_xp = models.PositiveIntegerField(default=0)
    league = models.CharField(max_length=100, default='Bronze')
    top3_finishes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.username

# Leaderboard Entry
class LeaderboardEntry(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_xp = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - XP: {self.total_xp}"

# Signal to auto-create UserProfile
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'userprofile'):
        UserProfile.objects.create(user=instance)
