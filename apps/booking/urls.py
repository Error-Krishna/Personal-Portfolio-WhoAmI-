from django.urls import path

from .views import book_page, inquiry_api

urlpatterns = [
    path("book/", book_page, name="book"),
    path("api/inquiry/", inquiry_api, name="inquiry_api"),
    path("api/contact/", inquiry_api, name="contact_submit"),
]
