from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ResearchOpportunity
from .serializers import ResearchOpportunitySerializer


class OpportunityListCreateView(APIView):

    def get(self, request):
        opportunities = ResearchOpportunity.objects.all()
        serializer = ResearchOpportunitySerializer(opportunities, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ResearchOpportunitySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class OpportunityDetailView(APIView):

    def get_object(self, pk):
        try:
            return ResearchOpportunity.objects.get(pk=pk)
        except ResearchOpportunity.DoesNotExist:
            return None

    def get(self, request, pk):
        opportunity = self.get_object(pk)

        if opportunity is None:
            return Response(
                {"error": "Research opportunity not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResearchOpportunitySerializer(opportunity)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):
        opportunity = self.get_object(pk)

        if opportunity is None:
            return Response(
                {"error": "Research opportunity not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ResearchOpportunitySerializer(
            opportunity,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        opportunity = self.get_object(pk)

        if opportunity is None:
            return Response(
                {"error": "Research opportunity not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        opportunity.delete()

        return Response(
            {"message": "Research opportunity deleted successfully."},
            status=status.HTTP_200_OK
        )