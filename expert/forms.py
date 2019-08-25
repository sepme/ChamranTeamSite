from django import forms
from .models import ExpertForm
from django.core.validators import EmailValidator


def is_numeric(string):
    for ch in string:
        if ch in '0123456789':
            return True
    return False


class InitialInfoForm(forms.Form):
    first_name = forms.CharField(max_length=32, error_messages={'required': "نام نمی تواند خالی باشد."})
    last_name = forms.CharField(max_length=32, error_messages={'required': "نام خانوادگی نمی تواند خالی باشد."})
    special_field = forms.CharField(max_length=256, error_messages={'required': "حوزه تخصصی نمی تواند خالی باشد."})
    melli_code = forms.IntegerField(error_messages={'required': "کد ملی نمی تواند خالی باشد.",
                                                    'invalid' : 'کد ملی باید عدد باشد.'})
    scientific_rank = forms.IntegerField(error_messages={'invalid': 'مرتبه علمی نباید خالی باشد!'})
    university = forms.CharField(max_length=128, error_messages={'required': "دانشگاه مورد نظر نمی تواند خالی باشد."})
    address = forms.CharField(widget=forms.Textarea(), error_messages={'required': "آدرس  نمی تواند خالی باشد."})
    home_number = forms.IntegerField(error_messages={'required': "شماره تلفن منزل نمی تواند خالی باشد.",
                                                     'invalid' : 'شماره تلفن ملی باید عدد باشد.'})
    phone_number = forms.IntegerField(error_messages={'required': "شماره تلفن همراه نمی تواند خالی باشد.",
                                                      'invalid' : 'شماره تلفن ملی باید عدد باشد.'})
    email_address = forms.EmailField(error_messages={'required': "ایمیل نمی تواند خالی باشد." ,
                                                     'invalid': 'ایمیل وارد شده نامعتبر است.'})

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        if is_numeric(first_name):
            raise forms.ValidationError('نام نباید شامل عدد باشد.')
        return first_name

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        if is_numeric(last_name):
            raise forms.ValidationError('نام خانوادگی نباید شامل عدد باشد.')
        return last_name

    def clean_email_address(self):
        current_email = self.cleaned_data.get('email_address')
        email = ExpertForm.objects.filter(email_address=current_email)
        if email.exists():
            raise forms.ValidationError('کاربر با این ایمیل قبلا ثبت نام شده است')

        return current_email

    def clean_melli_code(self):
        melli_code = self.cleaned_data.get('melli_code')

        if len(str(melli_code)) != 10:
            raise forms.ValidationError('کد ملی باید ده رقمی باشد.')
        return melli_code

    def clean_home_number(self):
        home_number = self.cleaned_data.get('home_number')
        if len(str(home_number)) != 10:
            raise forms.ValidationError('شماره تلفن منزل باید ده رقمی باشد.')
        return home_number

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        if len(str(phone_number)) != 10:
            raise forms.ValidationError('شماره تلفن همراه باید یازده رقمی باشد.')
        return phone_number

    def clean_scientific_rank(self):
        rank = self.cleaned_data.get('scientific_rank')
        print(rank)
        if rank is None or rank == '':
            raise forms.ValidationError('لطفا مرتبه علمی را انتخاب کنید.')
        return rank
