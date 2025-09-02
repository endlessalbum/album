
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessageViewSet, WishlistViewSet, ReactionViewSet, InviteViewSet

router = DefaultRouter()
router.register(r"messages", MessageViewSet)
router.register(r"wishlist", WishlistViewSet)
router.register(r"reactions", ReactionViewSet)
router.register(r"invites", InviteViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
