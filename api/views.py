from django.http import JsonResponse
import random
from quiz.models import Question

def get_quiz_question(request):
    word=Question.objects.order_by("?").first()
    if not word:
        return JsonResponse({"error": "No words found"}, status=404)
    correct_answer=word.tr
    other_options=list(Question.objects.exclude(id=word.id).order_by("?").values_list("tr", flat=True)[:3])
    options=[correct_answer]+other_options
    random.shuffle(options)
    return JsonResponse({
        "question_id":word.id,
        "question": word.en,
        "options": options,
        "answer":correct_answer,
    }, json_dumps_params={"ensure_ascii": False})

def convert_to_ascii(text: str):
    turkish_chars = "çğıöşüÇĞİÖŞÜ"
    english_chars = "cgiosuCGIOSU"
    translation_table = str.maketrans(turkish_chars, english_chars)
    return text.translate(translation_table)

def check_answer(request, question_id, user_answer):
    user_answer=convert_to_ascii(user_answer)
    try:
        word=Question.objects.get(id=question_id)
        correct_answer=convert_to_ascii(word.tr.upper())
        correct=(correct_answer.replace(" ", "-")==user_answer)
        return JsonResponse({
            "correct":correct,
            "correct_answer": correct_answer})
    except Question.DoesNotExist:
        return JsonResponse({"error": "Question not found"}, status=404)