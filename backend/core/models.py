from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
# Create your models here.

User = get_user_model()  # Dynamically get the User model
# we have no db yet so lets make one with the django orm

"""
Simple model for our Post. it includes the following(
    slug: a unique identifier for the post
    title: the title of the post
    content: the content of the post
    created_at: the date the post was created
    updated_at: the date the post was last updated
    author: the user who created the post
    )
"""
class Post(models.Model):
    slug = models.SlugField(unique=True, blank=True) # the url of our post
    title = models.CharField(max_length=200) # title of our post
    content = models.TextField() # content of our post
    created_at = models.DateTimeField(auto_now_add=True) # will forever stay the same date
    updated_at = models.DateTimeField(auto_now=True) # will change every time the post is updated
    author = models.ForeignKey(User, on_delete=models.CASCADE) # this is a foreign key
    
    
    # instead of "blogPost object (1)", it prints the title
    def __str__(self):
        return self.title
    
    # seo friendly slug
    def save(self, *args, **kwargs):
        if not self.slug: # check 
            base_slug = slugify(self.title) # convert title to slug
            unique_slug = base_slug # start with base slug
            counter += 1 # start counter at 1
            
            # check if slug already exist in the database
            while Post.objects.filter(slug=unique_slug).exist():
                unique_slug = f"{base_slug}-{counter}" # append number to a slug
                counter += 1 # increase counter for next check
            self.slug = unique_slug # assign the unique slug
        super().save(*args, **kwargs) # djangos default save
