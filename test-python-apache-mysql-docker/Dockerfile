FROM python:3.6.2-jessie
RUN apt-get update && apt-get upgrade -y
RUN apt-get install sudo
RUN sudo DEBIAN_FRONTEND=noninteractive apt-get -y install apache2
RUN sudo mkdir /var/www/test
RUN sudo a2dismod mpm_event
RUN sudo a2enmod mpm_prefork cgi
RUN sudo rm /etc/apache2/sites-enabled/000-default.conf
COPY ./000-default.conf /etc/apache2/sites-enabled/000-default.conf

WORKDIR /var/www/test
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN sudo chmod 755 ./config.sh
VOLUME ./app

CMD ["./config.sh"]
CMD [ "python", "./app/local.py" ]
