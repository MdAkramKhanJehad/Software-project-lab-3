from django.db import models

# Create your models here.
class Device(models.Model):
    device_name = models.CharField(max_length=100)
    category = models.CharField(max_length=40)

    def __str__(self):
        return self.device_name + " " + self.category


class DeviceAttribute(models.Model):
    attribute = models.TextField()
    action = models.TextField()
    description =models.TextField()
    device = models.ForeignKey(Device, on_delete=models.CASCADE)

    def __str__(self):
        return self.attribute + " " + self.action