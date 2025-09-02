
from rest_framework import viewsets
from .models import Message, WishlistItem, ReactionRule, Invite
from .serializers import MessageSerializer, WishlistSerializer, ReactionSerializer, InviteSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by("-created_at")
    serializer_class = MessageSerializer

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = WishlistItem.objects.all().order_by("-created_at")
    serializer_class = WishlistSerializer

class ReactionViewSet(viewsets.ModelViewSet):
    queryset = ReactionRule.objects.all().order_by("-created_at")
    serializer_class = ReactionSerializer

class InviteViewSet(viewsets.ModelViewSet):
    queryset = Invite.objects.all().order_by("-created_at")
    serializer_class = InviteSerializer
