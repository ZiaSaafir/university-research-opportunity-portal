from django.db import models


class ResearchOpportunity(models.Model):
    STATUS_CHOICES = [
        ("Open", "Open"),
        ("Closed", "Closed"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    research_area = models.CharField(max_length=100)
    faculty_name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    required_skills = models.TextField()
    available_positions = models.PositiveIntegerField()
    application_deadline = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="Open"
    )

    def __str__(self):
        return self.title