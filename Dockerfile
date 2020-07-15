FROM httpd:2.4

USER root

COPY build/* /usr/local/apache2/htdocs/