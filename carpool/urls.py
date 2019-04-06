from django.urls import path

from . import views

urlpatterns = [
    path('', views.home_action, name='home'),

    path('login', views.login_action, name='login'),
    path('logout', views.logout_action, name='logout'),
    path('register', views.register_action, name='register'),

    path('user/<id>', views.user_action, name='user'),
    path('edit/<int:id>', views.edit_user_action, name='edit'),
    path('photo/<int:id>', views.get_photo, name='photo'),

    path('make_request', views.make_request, name="make_request"),
    path('request', views.request_action, name="request"),

    path('make_review/<int:id>', views.make_review, name="make_review"),

]