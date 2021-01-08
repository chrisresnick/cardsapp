from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Class, User


class_routes = Blueprint('classes', __name__)


@class_routes.route("/")
@login_required
def getClassesCurUser():
    return current_user.to_classes_list()
