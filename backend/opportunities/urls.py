from django.urls import path
from .views import OpportunityListCreateView, OpportunityDetailView


urlpatterns = [
    path(
        "opportunities/",
        OpportunityListCreateView.as_view(),
        name="opportunity-list-create"
    ),

    path(
        "opportunities/<int:pk>/",
        OpportunityDetailView.as_view(),
        name="opportunity-detail"
    ),
]