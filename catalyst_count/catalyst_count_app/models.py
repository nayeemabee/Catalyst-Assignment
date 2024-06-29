from django.db import models
from chunked_upload.models import ChunkedUpload
# Create your models here.

class MyUpload(ChunkedUpload):
    pass

class Company(models.Model):
    company_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255)
    year_founded = models.IntegerField()
    industry = models.CharField(max_length=255)
    size_range = models.CharField(max_length=255)
    locality = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    linkedin_url = models.URLField()
    current_employees_estimate = models.CharField(max_length=255)
    total_employees_estimate = models.CharField(max_length=255)

    def __str__(self):
        return self.name