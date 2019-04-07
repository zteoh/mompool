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
    path('accept_request/<int:id>', views.accept_request, name="accept_request"),
    path('picked_request/<int:id>', views.picked_request, name="picked_request"),
    path('complete_request/<int:id>', views.complete_request, name="complete_request"),
    path('request', views.request_action, name="request"),
    path('my_request', views.my_request_action, name="my_request"),

    path('make_review/<int:id>', views.make_review, name="make_review"),

]