from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UnitViewSet, UserProgressViewSet, SignupView, UserProfileView, LeaderboardView, CourseViewSet, LessonViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView,  TokenVerifyView
from rest_framework.routers import DefaultRouter
from . import views  
router = DefaultRouter()
router.register(r'units', UnitViewSet)
router.register(r'progress', UserProgressViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet, basename='lessons')
urlpatterns = [
    path('', include(router.urls)),  # ⬅️ DRF viewsets
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    
    

]
