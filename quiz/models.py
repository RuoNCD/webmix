from django.db import models

class Question(models.Model):
    en=models.CharField(max_length=255)
    tr=models.CharField(max_length=255)
    example=models.TextField(blank=True, null=True)
    
    