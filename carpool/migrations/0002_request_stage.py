# Generated by Django 2.1.5 on 2019-04-07 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('carpool', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='request',
            name='stage',
            field=models.CharField(blank=True, default='requested', max_length=200),
        ),
    ]
