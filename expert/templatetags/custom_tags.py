from django import template
from persiantools.jdatetime import JalaliDate
from django.shortcuts import get_object_or_404

from expert.models import ExpertUser
from industry.models import Project ,Comment

register = template.Library()


@register.simple_tag
def calculate_date_past(date):
    diff = JalaliDate.today() - JalaliDate(date)
    days = diff.days
    if days < 1:
        return 'چند لحظه'
    elif days < 7:
        return '{} روز'.format(days)
    elif days < 30:
        return '{} هفته'.format(int(days / 7))
    elif days < 365:
        return '{} ماه'.format(int(days / 30))
    else:
        return '{} سال'.format(int(days / 365))


@register.simple_tag
def calculate_date_remaining(date):
    try:
        diff = JalaliDate(date) - JalaliDate.today()
        days = diff.days
        if days < 1:
            return '0 روز'
        elif days < 7:
            return '{} روز'.format(days)
        elif days < 30:
            return '{} هفته'.format(int(days / 7))
        elif days < 365:
            return '{} ماه'.format(int(days / 30))
        else:
            return '{} سال'.format(int(days / 365))
    except:
        return 'بدون تاریخ'


@register.simple_tag
def calculate_deadline(finished, started):
    try:
        diff = JalaliDate(finished) - JalaliDate(started)
        days = diff.days
        if days < 1:
            return None
        elif days < 7:
            return '{} روز'.format(days)
        elif days < 30:
            return '{} هفته'.format(int(days / 7))
        elif days < 365:
            return '{} ماه'.format(int(days / 30))
        else:
            return '{} سال'.format(int(days / 365))
    except:
        return 'بدون تاریخ'

@register.simple_tag
def getUnseenMessages(project_id ,expert):
    project = get_object_or_404(Project ,pk=project_id)
    all_unseen = Comment.objects.filter(project=project).filter(status='unseen')
    return all_unseen.exclude(industry_user=None).filter(expert_user=expert).count()