from email import message
from flask import Flask, redirect, render_template, url_for, session, request, g
from database import get_db, close_db
from sqlite3 import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_session import Session
from functools import wraps
from forms import *

# an admin account exists but just for the purposes of always having an account created
# instead of requiring to create a new user each time i reset the db

app = Flask(__name__)
app.config["SECRET_KEY"] = "this-is-my-secret-key"
app.teardown_appcontext(close_db)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.before_request
def load_logged_in_user():
    g.user = session.get("user_id", None)

def login_required(view):
    @wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(**kwargs)
    return wrapped_view

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user_id = form.user_id.data.title()
        password = form.password.data
        if not user_id.isalnum():
            form.user_id.errors.append("Username must be alphanumeric. (Only letters and numbers allowed)")
            return render_template("user_pages/register.html", 
                form=form, title="Register")
        db = get_db()
        try:
            db.execute("""INSERT INTO users (user_id, password)
                        VALUES (?, ?)""", (user_id, generate_password_hash(password)))
            db.commit()
            close_db()
            return redirect(url_for('login'))
        except IntegrityError:
            form.user_id.errors.append("User id is already taken.")
    return render_template("user_pages/register.html", 
        form=form, title="Register")

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_id = form.user_id.data.title()
        password = form.password.data

        db = get_db()
        user_exists = db.execute("""SELECT * FROM users
                                WHERE user_id = ?;""", (user_id,)).fetchone()
        close_db()
        if not user_exists:
            form.user_id.errors.append("Unknown user id!")
        elif not check_password_hash(user_exists["password"], password):
            form.password.errors.append("Incorrect password!")
        elif user_id in session:
             form.user_id.errors.append("Already logged in as "+user_id)
        else:
            session.pop("user_id", None)
            session["user_id"] = user_id
            next_page = request.args.get("next")
            if not next_page:
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("user_pages/login.html", 
        form=form, title="Login")

@app.route("/logout")
def logout():
    session.pop("user_id", None)
    return redirect(url_for("login"))

@app.route("/")
def index():
    return render_template("index.html", title="Info & Rules")

@app.route("/disclaimer")
def disclaimer():
    return render_template("disclaimer.html", title="Disclaimer")

@app.route("/game")
def game():
    return render_template("game.html")

@app.route("/save_score", methods=["GET", "POST"])
@login_required
def save_score():
    if request.method == "POST":
        score = int(request.form["score"])
        db = get_db()
        user_score = db.execute("SELECT score FROM leaderboard WHERE user_id = ?;", (g.user,)).fetchone()
        if not user_score:
            db.execute("""INSERT INTO leaderboard (user_id, score)
                        VALUES (?, ?);""", (g.user, score))
        elif user_score[0] <= score:
            db.execute("""UPDATE leaderboard
                        SET score = ?
                        WHERE user_id = ?;""", (score, g.user))
            session.pop("score", None)
        else:
            session["score"] = score
        db.commit()
        close_db()

    return redirect(url_for("leaderboard"))

@app.route("/leaderboard")
def leaderboard():
    db = get_db()
    message = ""
    leaderboard = db.execute("SELECT * FROM leaderboard").fetchall()
    if "score" in session:
        message = "Higher score already recorded in leaderboard for " + g.user
    return render_template("leaderboard.html", leaderboard=leaderboard, message=message, title="Leaderboard")