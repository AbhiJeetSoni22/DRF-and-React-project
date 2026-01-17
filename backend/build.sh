#!/usr/bin/env bash

pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# 🔥 Create superuser automatically (if not exists)
python manage.py createsuperuser \
  --noinput || true
