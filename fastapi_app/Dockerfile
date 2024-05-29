FROM python:3

WORKDIR /src
COPY . /fastapi_app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /fastapi_app/requirements.txt



