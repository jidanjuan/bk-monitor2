# Generated by Django 3.2.15 on 2024-12-24 07:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('bkmonitor', '0167_shield_label'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomeAlarmGraphConfig',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(db_index=True, max_length=64, verbose_name='用户名')),
                ('index', models.IntegerField(verbose_name='排序')),
                ('bk_biz_id', models.IntegerField(verbose_name='业务ID')),
                ('config', models.JSONField(default=list, verbose_name='配置')),
            ],
            options={
                'verbose_name': '首页告警图配置',
                'verbose_name_plural': '首页告警图配置',
                'db_table': 'home_alarm_graph_config',
            },
        ),
    ]
