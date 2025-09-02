from django.db import models
from django.utils import timezone


class Message(models.Model):
    sender = models.CharField(max_length=255)
    content = models.TextField()
    reaction = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class WishlistItem(models.Model):
    user_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class ReactionRule(models.Model):
    user_id = models.CharField(max_length=255)
    word = models.CharField(max_length=50)
    reaction = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)


class Invite(models.Model):
    owner_id = models.CharField(max_length=255)
    code = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # новые поля
    expires_at = models.DateTimeField(null=True, blank=True)
    used_by = models.CharField(max_length=255, null=True, blank=True)
    accepted_at = models.DateTimeField(null=True, blank=True)

    def is_expired(self) -> bool:
        """Проверяет, просрочен ли инвайт."""
        return bool(self.expires_at and timezone.now() > self.expires_at)

    def mark_used(self, user_id: str):
        """Отмечает инвайт как использованный."""
        self.used_by = user_id
        self.accepted_at = timezone.now()
        self.save()