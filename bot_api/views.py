# from django.shortcuts import render, HttpResponse
# from django.http import JsonResponse

# from industry.models import IndustryUser, Project
# from expert.models import ExpertUser
# from researcher.models import ResearcherUser
# import requests
# import uuid

# SECURITY_CODE = "BQ_?on|A5DUb_WdU4Y#4N$fL6L76$0XGpV+i%7A5jp5T3V!MkKDpXea^PRF-VLkr"

# def projectName(request, project_id):
#     try:
#         project = Project.objects.get(code=project_id)        
#         data = {
#             'project_name': project.project_form.persian_title,
#             'creator': project.industry_creator.profile.name,
#             'creator_photo': "None",
#         }
#         if project.industry_creator.profile.photo:
#             data['creator_photo'] = project.industry_creator.profile.photo.url        
#         return JsonResponse(data=data)
#     except:
#         return JsonResponse(data={"error": "the project_id is invalid"}, status=400)

# def searchUsername(request, keyword):
#     try:
#         expert = ExpertUser.objects.get(userId=keyword)
#         data = {
#             "fullname" : expert.expertform.fullname,
#             "photo" : "none",
#         }
#         if expert.expertform.photo:
#             data['photo'] = expert.expertform.photo.url
#         return JsonResponse(data=data)
#     except:
#         try:
#             industry = IndustryUser.objects.get(userId=keyword)
#             data = {
#                 "fullname" : industry.profile.name,
#                 "photo" : "none",
#             }
#             if industry.profile.photo:
#                 data['photo'] = industry.profile.photo.url
#             return JsonResponse(data=data)
#         except:
#             try:
#                 researcher = ResearcherUser.objects.get(userId=keyword)
#                 data = {
#                     "fullname" : researcher.researcherprofile.fullname,
#                     "photo" : "none",
#                 }
#                 if researcher.researcherprofile.photo:
#                     data['photo'] = researcher.researcherprofile.photo.url
#                 return JsonResponse(data=data)
#             except:
#                 return JsonResponse(date={"error": 'the keyword in invalid.'}, status=400)

# def sendProjectData(project):
#     data = {'experts': [],
#             'researchers': []
#             }
#     data['project'] = {'id': project.id,
#                         "persian_title": project.project_form.persian_title,
#                         "english_title": project.project_form.english_title,
#                         "code": str(project.code),
#                         }
#     data["industry"] = {'username': project.industry_creator.user.get_username(),
#                         "fullname": project.industry_creator.profile.name,
#                         "photo_url": "None"
#                         }
#     if project.industry_creator.profile.photo:
#         data['industry']["photo_url"] = project.industry_creator.profile.photo.url
    
#     for expert in project.expert_accepted.all():
#         data['experts'].append({'username': expert.user.get_username(),
#                                 "fullname": expert.expertform.fullname,
#                                 "photo_url": "None"
#                                 })
#         if expert.expertform.photo:
#             data['experts'][-1]["photo_url"] = expert.expertform.photo.url

#     for researcher in project.researcher_accepted.all():
#         data['researchers'].append({'username': researcher.user.get_username(),
#                                     "fullname": researcher.researcherprofile.fullname,
#                                     "photo_url": "None"
#                                 })
#         if researcher.researcherprofile.photo:
#             data['researchers'][-1]["photo_url"] = researcher.researcherprofile.photo.url
#     response = requests.post(url="https://chamranteam.pythonanywhere.com/add_project/",json=data)
#     return JsonResponse(data=data)
#     # return HttpResponse("OK")

# def updateBotUser(typeUser, projectId ,username, fullname, photo):
#     data = {
#         "typeUser": typeUser,
#         "projectId": projectId,
#         "username": username,
#         "fullname": fullname,
#         "photo": "none",
#     }
#     if photo:
#         data['photo'] = photo.url

#     response = requests.post(url="https://chamranteam.pythonanywhere.com/update_user/",json=data)
#     if response.status_code == 200:
#         if typeUser == "expert":
#             sendMessage(projectId=projectId, text="""استاد {} به این پروژه اضافه شدند.""".format(fullname))
#         elif typeUser == "researcher":
#             sendMessage(projectId=projectId, text="""پژوهشگر {} به این پروژه اضافه شدند.""".format(fullname))
#     return

# def sendMessage(projectId, text):
#     data = {
#         "securityCode":SECURITY_CODE,
#         "id": projectId,
#         "text": text
#     }
#     response = requests.post(url="https://chamranteam.pythonanywhere.com/send_message/",json=data)
#     return

# def updateTask(projectId, description, involved_username, deadline=None):
#     data = {
#         "id": projectId,
#         "description": description,
#         "deadline": deadline,
#         "involved_user": involved_username,
#     }
#     return requests.post(url="https://chamranteam.pythonanywhere.com/add_task/",json=data)

# def updateCard(projectId, title, deadline):
#     data = {
#         "id": projectId,
#         "title": title,
#         "deadline": str(deadline),
#     }
#     return requests.post(url="https://chamranteam.pythonanywhere.com/add_card/",json=data)
    

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_date
from django.core.mail import send_mail
from ChamranTeamSite import settings

from persiantools.jdatetime import JalaliDate

from . import models
from industry.models import Project
from chamran_admin.models import Task, Card
from .config import bot_token, URL, SECURITY_CODE
import telegram
import re, uuid ,json

WHITE_MEDIUM_SMALL_SQUARE = '\U000025FD'
CHECK_BOX_WITH_CHECK = '\U00002611\U0000FE0F'

global bot
global TOKEN
TOKEN=bot_token
bot = telegram.Bot(token=TOKEN)

def gregorian_to_numeric_jalali(date):
    if date:
        j_date = JalaliDate(date)
        return str(j_date.year) + '/' + str(j_date.month) + '/' + str(j_date.day)
    else:
        return "نا مشخص"

def set_webhook(request):
   s = bot.setWebhook(url='{}'.format(URL))
   if s:
       return HttpResponse("<h3>webhook setup ok</h3>")
   else:
       return HttpResponse("<h3>webhook setup failed</h3>")

def get_Webhook_info(request):
    g = bot.getWebhookInfo()
    if g:
        return HttpResponse("<h3>webhook url : {}</h3>".format(g['url']))
    else:
       return HttpResponse("<h3>get webhook Information failed</h3>")

def inlineQuery(update):
    projectId = update.inline_query.query
    try:
        project = Project.objects.get(code=projectId)
    except:
        print("There isn't any project with this code : {}".format(projectId))
        return
    keyboard = [[telegram.InlineKeyboardButton("تایید", callback_data=str(project.code))],]
    reply_markup = telegram.InlineKeyboardMarkup(keyboard)
    if project.industry_creator.profile.photo:
        photo_url = "https://chamranteam.ir" + project.industry_creator.profile.photo.url
    else:
        photo_url = ""
    
    results = [
        telegram.InlineQueryResultArticle(
            id=uuid.uuid4(),
            title=project.industry_creator.profile.name,
            description=project.project_form.persian_title,
            thumb_url=photo_url,
            reply_markup=reply_markup,
            input_message_content=telegram.InputTextMessageContent(
                "آیا مایل به متصل کردن گروه به پروژه {} هستید؟".\
                format(project.project_form.persian_title))),]
    update.inline_query.answer(results, cache_time=15)
    return

def myColleagueHandler(chat_id):
    project = models.Project.objects.get(group_id_set__in=[chat_id,])
    context = ""
    context += "مرکز پژوهشی : \n\t{}\n".format(project.industry_creator.fullname)
    context += "اساتید : \n"
    for expert in project.expert_accepted.all():
        context += "\t{}\n".format(expert.fullname)
    context += "پژوهشگران : \n"
    for researcher in project.researcher_accepted.all():
        context += "\t{}\n".format(researcher.fullname)
    bot.sendMessage(chat_id=chat_id, text=context)

def addNewGroup(newMemberList, chat_id):
    for newMember in newMemberList:
        if newMember.username == "ChamranTeam_bot":
            models.NewGroup.objects.create(group_id=str(chat_id))

def removeGroupHandler(removedMember, chat_id):
    if removedMember.username == "ChamranTeam_bot":
        try:
            group = models.NewGroup.objects.get(group_id=str(chat_id))
            group.delete()
        except:
            try:
                group = models.Group.objects.get(group_id=str(chat_id))
                group.delete()
            except:
                pass

def stageGroupAndProject(message):
    for keyboardList in message.reply_markup.inline_keyboard:
        for keyboard in keyboardList:
            text = keyboard.text
            if text == "تایید":
                try:
                    gp = models.NewGroup.objects.get(group_id=message.chat_id)
                    if gp.projectCode is None:
                        gp.projectCode = keyboard.callback_data
                        gp.save()
                except:
                    bot.send_message(chat_id=message.chat_id,
                                     text="لطفا در ابتدا ربات چمران تیم را به گروه مرتبط به پروژه اضافه کنید.")
            return 

def addGroupToProject(callBack):
    code = callBack['data']
    gp = models.NewGroup.objects.get(projectCode=code)
    project = Project.objects.get(code=code)
    group = models.Group.objects.create(group_id=gp.group_id, project=project)
    gp.delete()
    text = """{check} این گروه به پروژه «{title}» متصل شد.
{box} از این پس، رخدادهای مربوط به پروژه در این گروه یادآوری خواهد شد.""".\
    format(check=CHECK_BOX_WITH_CHECK,
           title=project.project_form.persian_title,
           box=WHITE_MEDIUM_SMALL_SQUARE)
    bot.send_message(chat_id=group.group_id,text=text)
    return HttpResponse("ok")

def allTaskHandler(chat_id):
    return

def startHandler(chat_id):
    bot_welcome = """
سلام
به ChamranTeam Bot خوش آمدید.
لطفا من را به گروه‌تان اضافه کنید و آن‌جا من را تنظیم کنید تا وقایع پروژه‌تان را اطلاع‌رسانی کنم.
اگر نمی‌دانید چطور این کار را انجام دهید، لطفا /help را بزنید.
    """
    bot.sendMessage(chat_id=chat_id, text=bot_welcome)
    return HttpResponse('ok')

def helpHandler(chat_id):
    # TODO : Hey;) write your text in the next line...
    help_text = """
برای این که بتوانم وقایع پروژه را در گروه تلگرامی مد نظرتان اطلاع‌رسانی کنم، ابتدا لازم است من را به آن گروه اضافه کنید. برای این کار، می‌توانید یکی از این دو کار را انجام دهید:
1. در پروفایل من، روی تصویر سه نقطه بالا سمت راست کلیک کنید و Add to Group را بزنید؛
2. در پروفایل گروه مورد نظر بروید و با استفاده از گزینه Add Member، من را اضافه کنید.

خب، حالا در خدمت‌م! فقط کافی‌ست که کد پروژه‌تان را به من بگویید! کد پروژه در صفحه مدیریت پروژه شما در سامانه ChamranTeam قابل مشاهده است.
برای این کار، لطفا در همان گروه، من را منشن کنید و پس از یک space، کد پروژه‌تان را برایم بنویسید. برای مثال، اگر کد پروژه شما 31886d75-e2ad-93a8-b608-5dec9921708a است، من را این‌طور صدا بزنید:
@ChamranTeam_bot 31886d75-e2ad-93a8-b608-5dec9921708a
اگر کد پروژه صحیح باشد، با وارد کردن این متن، پروژه شما در بالای متن تایپ شده، نمایش داده می‌شود. با کلیک روی آن پروژه، آن گروه تلگرامی برای پروژه‌تان ثبت می‌شود.
دیگر از این به بعد، کارها را به من بسپارید!
موفق باشید
    """
    bot.sendMessage(chat_id=chat_id, text=help_text)
    return HttpResponse('ok')


@csrf_exempt
def telegramHandler(request):
    if request.method == "GET":
       return HttpResponse("GET Method is OK")
    try:
        update = telegram.Update.de_json(json.loads(request.body), bot)
        message = update.effective_message
        # print(update)
        # print("+++++++++++++=")
        if message is None:
            try:
                inlineQuery(update)
                return HttpResponse('ok')
            except Exception as exc:
                addGroupToProject(update.callback_query)
                return HttpResponse("ok")

        if message.reply_markup is not None:
            stageGroupAndProject(message)
            return HttpResponse("ok")

        if len(message.new_chat_members):        
            addNewGroup(newMemberList=message.new_chat_members, chat_id=message.chat_id)
            return HttpResponse('ok')
        if message.left_chat_member is not None:
            removeGroupHandler(removedMember=message.left_chat_member, chat_id=message.chat_id)
            return HttpResponse("ok")
        try:
            chat_id = message.chat.id
            msg_id = message.message_id
        except:
            return HttpResponse("ok")

        text = message.text.encode('utf-8').decode()
        if message.entities:
            if message.entities[0].type == "bot_command":
                command = text[message.entities[0].offset:message.entities[0].offset+message.entities[0].length]
                if text == "/start":
                    try:
                        startHandler(chat_id=chat_id)
                    except:
                        bot.sendMessage(chat_id=chat_id, text="با عرض پوزش درحال حاضر اطلاعاتی در دسترس نیست.")
                elif text == "/all_task":
                    try:
                        allTaskHandler(chat_id=chat_id)
                    except:
                        bot.sendMessage(chat_id=chat_id, text="با عرض پوزش درحال حاضر اطلاعاتی در دسترس نیست.")
                elif text == "/my_colleague":
                    try:
                        myColleagueHandler(chat_id=chat_id)
                    except:
                        bot.sendMessage(chat_id=chat_id, text="با عرض پوزش درحال حاضر اطلاعاتی در دسترس نیست.")
                elif text == "/help":
                    try:
                        helpHandler(chat_id=chat_id)
                    except:
                        bot.sendMessage(chat_id=chat_id, text="با عرض پوزش درحال حاضر اطلاعاتی در دسترس نیست.")

        elif text == "/start":
            startHandler(chat_id=chat_id)

        else:
            pass
            # try:
            #     helpHandler(chat_id=chat_id)
            # except:
            #     bot.sendMessage(chat_id=chat_id, text="با عرض پوزش درحال حاضر اطلاعاتی در دسترس نیست.")

        return HttpResponse('ok')
    except:
        return HttpResponse("ok")


def sendMessage(project, text, url=None):
    if url is None:
        for gp in project.group_set.all():
            bot.sendMessage(chat_id=gp.group_id, text=text)
    else:
        keyboard = [[telegram.InlineKeyboardButton("مشاهده پروژه", url=url)],]
        reply_markup = telegram.InlineKeyboardMarkup(keyboard)
        for gp in project.group_set.all():
            bot.sendMessage(chat_id=gp.group_id, text=text, reply_markup=reply_markup)


# @csrf_exempt
# def addProject(request):
#     inputData = json.loads(request.body)
#     industry = add_user(inputData["industry"])
#     projectInfo = inputData['project']
#     project = models.Project.objects.create(id=projectInfo["id"],
#                                             persian_title=projectInfo["persian_title"],
#                                             english_title=projectInfo["english_title"],
#                                             code=projectInfo["code"],
#                                             industry_creator=industry
#                                             )
#     for expertInfo in inputData['experts']:
#         project.expert_accepted.add(add_user(expertInfo))

#     for researcherInfo in inputData['researchers']:
#         project.researcher_accepted.add(add_user(researcherInfo))

#     return HttpResponse("OK")
    # return JsonResponse(data={'success': "success"})


# @csrf_exempt
# def updateUser(request):
#     inputData = json.loads(request.body)
#     user = add_user(inputData)
#     project = models.Project.objects.get(id=inputData['projectId'])
#     if inputData['typeUser'] == 'expert':
#         project.expert_accepted.add(user)
#     elif inputData['typeUser'] == 'researcher':
#         project.researcher_accepted(user)

#     return HttpResponse("OK")


# @csrf_exempt
# def addTask(project, description, involved_user, deadline):
#     try:
#         involved_user = ""
#         for username in involved_user:
#             involved_user += user.fullname + "\n"
#         text = """وظیفه {title} به {involved_user} محول شده و لازم است تا تاریخ {deadline} انجام شود.
# برای اطلاعات بیشتر می‌توانید دکمه «مشاهده پروژه» در زیر این پیام را بزنید. """.\
#                 format({"title":newTask.description,
#                         "involved_user":involved_user,
#                         "deadline": gregorian_to_numeric_jalali(newTask.deadline)})
#         bot.sendMessage(chat_id=project.group_id, text=text)
#         return HttpResponse("OK")
#     except:
#         return HttpResponse("ERROR HAPPEND", status=503)

# def addCard(project, title, deadline=None):
#     try:
#         for gp_id in project.group_set.all():
#             text = "فاز {title} به پروژه اضافه شده است و لازم است تا تاریخ {deadline} انجام شود.".\
#                 format({"title": title, "deadline": deadline})
#             bot.sendMessage(chat_id=gp_id, text=text)
#     except:
#         pass
