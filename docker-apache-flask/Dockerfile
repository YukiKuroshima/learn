FROM httpd:2.4
COPY ./public-html/ /usr/local/apache2/htdocs/
RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y python3
RUN python3 --version
RUN apt-get install -y python3-pip
RUN httpd -v
