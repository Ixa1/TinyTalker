from django.db import models
from django.contrib.auth.models import User

# ==========================
# COURSE & LESSON STRUCTURE
# ==========================

class Course(models.Model):
    """Represents a language course like 'English' or 'Nepali'."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to='course_icons/', null=True, blank=True)  # Icon displayed in frontend

    def __str__(self):
        return self.name


class Lesson(models.Model):
    """A lesson inside a course, like 'Basics 1'."""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)  # Controls display order
    xp = models.PositiveIntegerField(default=10)  # XP awarded on completion
    section = models.CharField(max_length=255, blank=True)  # Optional section title

    def __str__(self):
        return f"{self.course.name} - {self.title}"

    class Meta:
        app_label = 'core'
        ordering = ['order']  # Ensures lessons are ordered properly


# ==========================
# QUESTION MODEL
# ==========================

class LessonQuestion(models.Model):
    """Question attached to a specific lesson (MCQ style)."""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='questions')
    question = models.CharField(max_length=100)
    option1 = models.CharField(max_length=100)
    option2 = models.CharField(max_length=100)
    option3 = models.CharField(max_length=100)
    option4 = models.CharField(max_length=100)
    answer = models.CharField(max_length=100)  # Correct option text

    def __str__(self):
        return f"Q: {self.question} (Lesson: {self.lesson.title})"

class Question(models.Model):
    lesson = models.ForeignKey(
        'Lesson',
        on_delete=models.CASCADE,
        related_name='json_questions'  # 💡 Unique name to avoid clash
    )
    question_text = models.TextField()
    options = models.JSONField()
    answer = models.CharField(max_length=255)

    def __str__(self):
        return self.question_text
class MatchingQuestion(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='matching_questions')
    question_text = models.TextField()
    # Store column A and B as lists of strings (JSONField)
    column_a = models.JSONField()  # E.g. ["Cat", "Run", "Apple", ...]
    column_b = models.JSONField()  # E.g. ["A fruit", "Opposite of cold", ...]
    correct_pairs = models.JSONField()  # E.g. [{"1": "C"}, {"2": "E"}, ...] or {"1": "C", "2": "E", ...}

    def __str__(self):
        return self.question_text

# ==========================
# UNIT MODEL (Optional Grouping)
# ==========================

class Unit(models.Model):
    """Optional grouping for lessons under a unit (e.g., Level 1)."""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    language = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.language} - {self.title}"


# ==========================
# USER PROGRESS TRACKING
# ==========================

class UserProgress(models.Model):
    """Tracks user's XP and completion status per lesson/unit."""
    user_id = models.CharField(max_length=255)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, blank=True)
    xp = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user_id} - {self.lesson.title} - XP: {self.xp}"


# ==========================
# USER PROFILE
# ==========================

class UserProfile(models.Model):
    """Extended info for each user, like profile picture, streak, etc."""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)  # ✅ this line is required
    total_xp = models.IntegerField(default=0)
    hearts = models.IntegerField(default=5)
    streak = models.IntegerField(default=0)
    league = models.CharField(max_length=50, default='Bronze')
    top3_finishes = models.IntegerField(default=0) # Leaderboard placement

    selected_course = models.ForeignKey('Course', on_delete=models.SET_NULL, null=True, blank=True)
    def refill_heart_if_needed(self):
        if self.hearts < 5:
            self.hearts += 1
            self.save()


# ==========================
# LEADERBOARD
# ==========================

class LeaderboardEntry(models.Model):
    """Stores user ranking by total XP."""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_xp = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - XP: {self.total_xp}"


# ==========================
# REPORTS (Admin Insight)
# ==========================

class Report(models.Model):
    """Optional report model for analytics or feedback."""
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)


# ==========================
# SIGNAL TO AUTO-CREATE USER PROFILE
# ==========================

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Auto-creates a profile when a new user signs up."""
    if created and not hasattr(instance, 'userprofile'):
        UserProfile.objects.create(user=instance)
# ==========================
# DAILY QUESTS
# ==========================

class DailyQuest(models.Model):
    QUEST_TYPES = [
        ('xp', 'Earn XP'),
        ('streak', 'Correct in a Row'),
        ('accuracy', 'High Accuracy'),
    ]
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=QUEST_TYPES)
    target = models.IntegerField()
    reward_xp = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.title} ({self.type})"


class UserDailyQuest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quest = models.ForeignKey(DailyQuest, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    date_assigned = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'quest', 'date_assigned')

    def __str__(self):
        return f"{self.user.username} - {self.quest.title} ({self.date_assigned})"
