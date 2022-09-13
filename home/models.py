from django.db import models
import json

# Create your models here.
class Device(models.Model):
    device_name = models.CharField(max_length=100)
    category = models.CharField(max_length=40)

    def __str__(self):
        return self.device_name
    
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


class DeviceAttribute(models.Model):
    attribute = models.TextField()
    action = models.TextField()
    description =models.TextField()
    device = models.ForeignKey(Device, on_delete=models.CASCADE)

    def __str__(self):
        return self.attribute