from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core import serializers
from django.urls import reverse

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from django.utils import timezone

from carpool.models import *
from carpool.forms import *

# Log in/ log out/ register

@ensure_csrf_cookie
def login_action(request):
    context = {}

    if request.method == 'GET':
        context['form'] = LoginForm()
        return render(request, 'carpool/login.html', context)

    form = LoginForm(request.POST)
    context['form'] = form

    if not form.is_valid():
        return render(request, 'carpool/login.html', context)

    new_user = authenticate(username=form.cleaned_data['username'],
                            password=form.cleaned_data['password'])

    login(request, new_user)
    return redirect(reverse('home'))

@login_required
def logout_action(request):
    logout(request)
    return redirect(reverse('login'))

def register_action(request):
    context = {}

    if request.method == 'GET':
        context['form'] = RegistrationForm()
        return render(request, 'carpool/register.html', context)

    form = RegistrationForm(request.POST)
    context['form'] = form

    if not form.is_valid():
        return render(request, 'carpool/register.html', context)

    new_user = User.objects.create_user(username=form.cleaned_data['username'], 
                                        password=form.cleaned_data['password'],
                                        email=form.cleaned_data['email'],
                                        first_name=form.cleaned_data['first_name'],
                                        last_name=form.cleaned_data['last_name'])
    new_user.save()

    new_user = authenticate(username=form.cleaned_data['username'],
                            password=form.cleaned_data['password'])

    # create Profile instance
    new_profile = Profile(assoc_user=new_user)
    new_profile.save()

    login(request, new_user)

    return redirect(reverse('home'))

# === Views ===

def home_action(request):
    requests_accepted = Request.objects.filter(stage = 'accepted')
    requests_progress = Request.objects.filter(stage = 'progress')
    requests_completed = Request.objects.filter(stage = 'completed')
    context = {'requests_accepted':requests_accepted, 'requests_progress':requests_progress, 'requests_completed':requests_completed}
    return render(request, 'carpool/home.html', context)

@login_required
def request_action(request):
    errors = []
    requests = Request.objects.filter(stage = 'requested')
    context = {'requests':requests}
    # my_profile = Profile.objects.get(user = request.user)
    # posts = Post.objects.filter(user__in=my_profile.following.all()).order_by('-datetime')
    # comment = Comment.objects.order_by('datetime')
    # context = {'posts': posts, 'comments': comment, 'errors': errors}
    return render(request, 'carpool/request.html', context)

@login_required
def my_request_action(request):
    errors = []
    requests = Request.objects.filter(stage = 'requested')
    context = {'requests':requests}
    # my_profile = Profile.objects.get(user = request.user)
    # posts = Post.objects.filter(user__in=my_profile.following.all()).order_by('-datetime')
    # comment = Comment.objects.order_by('datetime')
    # context = {'posts': posts, 'comments': comment, 'errors': errors}
    return render(request, 'carpool/request.html', context)


@login_required
def user_action(request, id):
    context = {}
    other_user = User.objects.get(id = id)
    profile = Profile.objects.get(assoc_user=other_user)
    form = ProfileForm(instance=profile)

    reviews = Review.objects.order_by('-datetime')
    context = {'profile': profile, 'form': form, 'reviews': reviews}
    return render(request, 'carpool/user.html', context)

def get_photo(request, id):
    user = User.objects.get(id = id)
    profile = get_object_or_404(Profile, assoc_user=user)
    print('Picture #{} fetched from db: {} (type={})'.format(id, profile.pro_pic, type(profile.pro_pic)))

    # Maybe we don't need this check as form validation requires a picture be uploaded.
    # But someone could have delete the picture leaving the DB with a bad references.
    if not profile.pro_pic:
        raise Http404

    return HttpResponse(profile.pro_pic, content_type=profile.content_type)

@login_required
# @transaction.atomic
def edit_user_action(request, id):
    context = {}

    if request.method == 'GET':
        profile = Profile.objects.get(assoc_user=request.user)
        form = ProfileForm(instance=profile)
        context = { 'profile': profile, 'form': form }
        return render(request, 'quizapp/user.html', context)

    profile = Profile.objects.get(assoc_user=request.user)
    form = ProfileForm(request.POST, request.FILES, instance=profile)

    if not form.is_valid():
        context['form'] = form
    else:
        # Must copy content_type into a new model field because the model
        # FileField will not store this in the database.  (The uploaded file
        # is actually a different object than what's return from a DB read.)
        pic = form.cleaned_data['pro_pic']
        print('Uploaded picture: {} (type={})'.format(pic, type(pic)))

        try:
            profile.content_type = form.cleaned_data['pro_pic'].content_type
        except:
            pass

        form.save()
        profile.save()

    return redirect(user_action, id)


# Actions
def make_request(request):
    new_request = Request(name=request.POST['name'],
                        description=request.POST['description'],
                        from_location=request.POST['from_location'],
                        to_location=request.POST['to_location'],
                        datetime=request.POST['datetime'],
                        assoc_user=request.user)
    new_request.save()

    return redirect(request_action)

def accept_request(request, id):
    request = Request.objects.get(id = id)
    request.stage = 'accepted'
    request.save()

    return redirect(home_action)

def picked_request(request, id):
    request = Request.objects.get(id = id)
    request.stage = 'progress'
    request.save()

    return redirect(home_action)

def complete_request(request, id):
    request = Request.objects.get(id = id)
    request.stage = 'completed'
    request.save()

    return redirect(home_action)

def make_review(request, id):
    new_review = Review(review_text=request.POST['review_text'],
                        user=id,
                        assoc_user=request.user,
                        datetime=timezone.now())
    new_review.save()

    return redirect(user_action, id)

