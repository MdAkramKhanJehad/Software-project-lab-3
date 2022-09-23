from django.db import models

# Create your models here.

class NewUser(models.Model):
    user_id = models.TextField(max_length = 254)

    def __str__(self):
        return self.user_id
