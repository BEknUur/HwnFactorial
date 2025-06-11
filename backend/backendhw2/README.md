# how to run the program 

sudo docker-compose up --build 



# for checking connection to the redis


docker-compose exec redis redis-cli PING


# for checking connection to the celery 

docker-compose exec celery_worker \
  celery -A app.celery_app.celery inspect registered  


docker-compose exec celery_worker \
  celery -A app.celery_app.celery status