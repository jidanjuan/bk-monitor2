# Generated by Django 3.2.15 on 2024-12-05 08:52

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('metadata', '0201_bcsclusterinfo_is_deleted_allow_view'),
    ]

    operations = [
        migrations.AddField(
            model_name='esfieldqueryaliasoption',
            name='path_type',
            field=models.CharField(default='keyword', max_length=128, verbose_name='路径类型'),
        ),
    ]
