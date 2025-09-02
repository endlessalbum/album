
from rest_framework import serializers
from .models import Message, WishlistItem, ReactionRule, Invite

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItem
        fields = "__all__"

class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReactionRule
        fields = "__all__"

class InviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invite
        fields = "__all__"
