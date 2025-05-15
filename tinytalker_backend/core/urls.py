from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UnitViewSet, UserProgressViewSet, SignupView, UserProfileView,
    LeaderboardView, CourseViewSet, LessonViewSet, update_user_progress,
    CustomTokenObtainPairView, root_view, admin_summary
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'units', UnitViewSet)
router.register(r'progress', UserProgressViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet, basename='lessons')

urlpatterns = [
    path('', include(router.urls)),  # ✅ API viewsets
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('user/progress/', update_user_progress, name='update_user_progress'),
    path('', root_view),  # API health check
    path('admin/summary/', admin_summary, name='admin-summary'),
]
