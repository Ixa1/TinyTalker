from django.contrib import admin
from django.utils.html import format_html
from .models import Course, Lesson, Question 

class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'icon_preview')
    readonly_fields = ('icon_preview',)

    def icon_preview(self, obj):
        if obj.icon:
            return format_html('<img src="{}" style="height: 40px; border-radius: 4px;" />', obj.icon.url)
        return "-"
    icon_preview.short_description = "Icon"

class LessonAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'course', 'order', 'xp', 'section')
    list_filter = ('course', 'section')
    search_fields = ('title', 'description', 'section')
    ordering = ('course', 'order')

# ✅ Register only once and correctly
admin.site.register(Course, CourseAdmin)
admin.site.register(Lesson, LessonAdmin)
@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('lesson', 'question_text', 'answer')
    search_fields = ('question_text',)