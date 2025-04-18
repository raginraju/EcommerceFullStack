Create DB using
create database ecommerce_db;

-----shutting down Docker---------
docker-compose down
-----shutting down Docker also removing data from DB ---------
docker-compose down -v

-----Starting Docker---------
docker-compose up --build
