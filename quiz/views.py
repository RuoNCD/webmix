from django.shortcuts import render
import requests

def quiz(request):
    return render(request, "index.html")