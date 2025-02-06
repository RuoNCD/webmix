from django.urls import path
from .views import get_quiz_question, check_answer

urlpatterns=[
    path('quiz/', get_quiz_question, name="quiz_question"),
    path("check-answer/<int:question_id>/<str:user_answer>/", check_answer, name="check_answer"),  # Yeni URL
]