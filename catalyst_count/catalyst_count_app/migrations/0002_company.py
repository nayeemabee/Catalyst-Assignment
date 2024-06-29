# Generated by Django 5.0.6 on 2024-06-29 10:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalyst_count_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_id', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('domain', models.CharField(max_length=255)),
                ('year_founded', models.IntegerField()),
                ('industry', models.CharField(max_length=255)),
                ('size_range', models.CharField(max_length=255)),
                ('locality', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('linkedin_url', models.URLField()),
                ('current_employees_estimate', models.CharField(max_length=255)),
                ('total_employees_estimate', models.CharField(max_length=255)),
            ],
        ),
    ]
