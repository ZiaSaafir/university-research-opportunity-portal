from rest_framework import serializers
from .models import ResearchOpportunity


class ResearchOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchOpportunity
        fields = "__all__"