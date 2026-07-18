from flask import Blueprint, request, jsonify
from database.db import get_db
import jwt
import datetime

SECRET = "secretkey"

auth_bp = Blueprint("auth", __name__)

# SIGNUP
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    db = get_db()

    try:
        db.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (data["username"], data["password"])
        )
        db.commit()
        return jsonify({"message": "User created"})
    except:
        return jsonify({"error": "User exists"}), 400


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    db = get_db()

    user = db.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (data["username"], data["password"])
    ).fetchone()

    if user:
        token = jwt.encode({
            "user_id": user["id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET, algorithm="HS256")

        return jsonify({"token": token})

    return jsonify({"error": "Invalid credentials"}), 401