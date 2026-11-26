FROM php:8.2-apache

# PDO MySQL extension for the database connection
RUN docker-php-ext-install pdo pdo_mysql

# Application code
COPY api/ /var/www/html/api/
COPY public/ /var/www/html/public/

EXPOSE 80

CMD ["apache2-foreground"]
