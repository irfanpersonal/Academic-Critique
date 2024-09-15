# Academic Critique

Academic Critique is a comprehensive platform designed to provide students and educators with valuable insights into academic institutions, courses, and educators. The platform enables users to read and write detailed reviews, rate their experiences, and access essential information such as course syllabi, class sizes, and institution-specific data. The goal is to create a transparent and user-friendly environment where students can make informed decisions about their education and share their perspectives on various aspects of academic life.

## Technologies Used

- [Python](https://www.python.org/): A versatile, high-level programming language known for its readability, ease of use, and wide range of applications, including web development, data analysis, artificial intelligence, and more.
- [Flask](https://flask.palletsprojects.com/): A lightweight WSGI web application framework in Python, designed with simplicity and flexibility in mind.
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/): An extension for Flask that adds support for SQLAlchemy, the Python SQL toolkit and ORM.
- [Flask-Migrate](https://flask-migrate.readthedocs.io/en/latest/): An extension that handles SQLAlchemy database migrations for Flask applications using Alembic.
- [Pydantic](https://docs.pydantic.dev/): A data validation and parsing library that ensures type safety and validation for Python data structures.
- [Waitress WSGI](https://docs.pylonsproject.org/projects/waitress/en/stable/): A production-quality pure-Python WSGI server for serving Python web applications.
- [MySQL](https://www.mysql.com/): A widely used open-source relational database management system known for its reliability and performance.
- [React](https://react.dev/): A JavaScript library for building user interfaces, maintained by Facebook, and widely adopted for creating dynamic web applications.

## Setup Instructions

1st - Download the project

2nd - Create a virtual environment using the built in "venv" module.

python3 -m venv .venv

python3 is the Python Interpreter you want to use
-m is a flag that says I would like to run a module as a script
venv is the built in module used to creating virtual environments
.venv is the virtual environment name I would like to have (convention)

3rd - Install all the dependencies

pip install -r requirements.txt

4th - Now create a .env file in the root of your entire project with the following key value pairs: FLASK_ENV, DATABASE_URL, JWT_SECRET, JWT_LIFETIME, SENDGRID_API_KEY, and SENDGRID_VERIFIED_SENDER

Where FLASK_ENV can be set to either "development" or "production"
Where DATABASE_URL is the location of your database
Where JWT_SECRET is the secret string of text you would like to set for encoding/decoding your JWT
Where JWT_LIFETIME is the amount of days you would like it to take before the JWT is deleted by itself
Where SENDGRID_API_KEY and SENDGRID_VERIFIED_SENDER are used to send emails using the Sendgrid API

Optional PYTHONDONTWRITEBYTECODE if during development you don't like those annoying __pycache__ folders

5th - Now create a .env file in the root of the "client" folder with the following key value pairs: REACT_APP_API_BASE_URL

Where REACT_APP_API_BASE_URL is the value of the base path. 

6th - Create the Production Ready Application by running "npm run build" in the client folder.

7th - Open up your MySQL server and create a database called "ACADEMIC_CRITIQUE". So just copy paste this code in and execute it

CREATE DATABASE ACADEMIC_CRITIQUE;

8th - To create the necessary tables for this application, run the following command

flask db upgrade

9th - Run the app.py file to start up the application

DONE