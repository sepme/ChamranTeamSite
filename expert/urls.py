from django.urls import path
from . import views

app_name = 'expert'
urlpatterns = [
    path('<int:pk>', views.Index.as_view() ,name='index'),
]