from flask import Flask
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import InputRequired, EqualTo, Length 

class RegistrationForm(FlaskForm):
    user_id = StringField("Username: ", 
        validators=[InputRequired(), Length(min=3, max=18, message="Username must be at least 3 characters.")])
    password = PasswordField("Password: ", 
        validators=[InputRequired(message="Password required."), Length(min=5, max=25, message="Password must be at least 5 characters.")])
    confirm_password = PasswordField("Confirm Password: ", 
        validators=[InputRequired(message="Password required."), Length(min=5, max=25, message="Password must be at least 5 characters."), EqualTo("password", message="Passowrds did not match.")])
    submit = SubmitField("Register")

class LoginForm(FlaskForm):
    user_id = StringField("Username: ", 
        validators=[InputRequired(message="Username required."), Length(min=3, message="Userame must be at least 3 characters.")])
    password = PasswordField("Password: ", 
        validators=[InputRequired(message="Password required.")])
    submit = SubmitField("Login")