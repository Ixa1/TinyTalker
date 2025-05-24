from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    # ViewSets for REST API router
    UnitViewSet,
    UserProgressViewSet,
    CourseViewSet,
    LessonViewSet,
    LeaderboardViewSet,

    # API Views
    SignupView,
    UserProfileView,
    activate_user,
    LessonQuestionsView,
    submit_answer,
    CustomTokenObtainPairView,
    update_user_progress,
    root_view,
    admin_summary,
    admin_user_list,
    user_course_distribution,
    save_user_course,
    get_questions_by_lesson,
    question_handler,
    delete_question_by_id,
    get_user_quests, update_quest_progress,
)

# Registering all ViewSets to the router
router = DefaultRouter()
router.register(r'units', UnitViewSet)
router.register(r'progress', UserProgressViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet, basename='lessons')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')

# URL Patterns
urlpatterns = [
    path('', include(router.urls)),  # Includes all router endpoints
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/auth/activate/<uidb64>/<token>/', activate_user, name='activate-user'),

    # Lessons and Progress
    path('user/progress/', update_user_progress, name='update_user_progress'),
    path('select-course/', save_user_course, name='select-course'),
    path('quests/', get_user_quests, name='get_user_quests'),
    path('quests/<int:quest_id>/progress/', update_quest_progress, name='update_quest_progress'),    

    # Questions
    path('questions/', get_questions_by_lesson, name='get-questions'),
    path('questions/', question_handler, name='question-handler'),
    path('questions/', LessonQuestionsView.as_view(), name='lesson-questions'),
    path('questions/<int:pk>/', delete_question_by_id, name='delete-question'),
    path('questions/<int:question_id>/submit/', submit_answer, name='submit-answer'),

    # Admin routes
    path('admin/', admin.site.urls),
    path('admin/summary/', admin_summary, name='admin-summary'),
    path('api/admin/users/', admin_user_list),
    path('api/admin/user-course-distribution/', user_course_distribution),

    # Health check
    path('health/', root_view),
    path('', root_view),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
