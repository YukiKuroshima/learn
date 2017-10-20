FROM python:3.6.3-jessie
RUN apt-get install libapache2-mod-wsgi
RUN mkdir /var/www/myapp
COPY ./app.wsgi ./var/www/myapp

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 80
CMD ["python", "./app.py"]
