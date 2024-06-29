from django.db import models
from chunked_upload.models import ChunkedUpload
# Create your models here.

class MyUpload(ChunkedUpload):
    pass

class Company(models.Model):
    company_id = models.CharField(max_length=255, null=True, blank=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    domain = models.CharField(max_length=255, null=True, blank=True)
    year_founded = models.IntegerField(null=True, blank=True)
    industry = models.CharField(max_length=255, null=True, blank=True)
    size_range = models.CharField(max_length=255, null=True, blank=True)
    locality = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    linkedin_url = models.URLField(null=True, blank=True)
    current_employees_estimate = models.CharField(max_length=255, null=True, blank=True)
    total_employees_estimate = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name