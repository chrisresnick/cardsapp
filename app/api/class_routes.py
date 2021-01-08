from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Class, User, db


class_routes = Blueprint('classes', __name__)


@class_routes.route("/")
@login_required
def getClassesCurUser():
    return current_user.to_classes_list()


@class_routes.route("/", methods=["POST"])
@login_required
def createClass():
    name = request.json["name"]
    newClass = Class(name=name, ownerId=current_user.id)
    current_user.classesOwned.append(newClass)
    db.session.commit()
    return newClass.to_dict()
