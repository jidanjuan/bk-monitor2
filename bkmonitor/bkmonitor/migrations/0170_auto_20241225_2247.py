# Generated by Django 3.2.15 on 2024-12-25 14:47

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('bkmonitor', '0169_auto_20241225_1959'),
    ]

    operations = [
        migrations.AddField(
            model_name='renderimagetask',
            name='username',
            field=models.CharField(default='', max_length=128, verbose_name='用户名'),
        ),
        migrations.AlterField(
            model_name='apiauthtoken',
            name='type',
            field=models.CharField(
                choices=[
                    ('as_code', 'AsCode'),
                    ('grafana', 'Grafana'),
                    ('api', 'API'),
                    ('uptime_check', 'UptimeCheck'),
                    ('host', 'Host'),
                    ('collect', 'Collect'),
                    ('scene', 'Scene'),
                    ('custom_metric', 'CustomMetric'),
                    ('custom_event', 'CustomEvent'),
                    ('kubernetes', 'Kubernetes'),
                    ('event', 'Event'),
                    ('dashboard', 'Dashboard'),
                    ('apm', 'Apm'),
                    ('incident', 'Incident'),
                ],
                max_length=32,
                verbose_name='鉴权类型',
            ),
        ),
        migrations.AlterField(
            model_name='renderimagetask',
            name='create_time',
            field=models.DateTimeField(auto_now_add=True, verbose_name='创建时间'),
        ),
    ]
