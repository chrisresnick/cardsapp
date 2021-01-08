from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Class, User, EnrollmentRequest, Notification, db


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


@class_routes.route("/enroll", methods=["POST"])
@login_required
def requestEnrollment():
    key = request.json["key"]
    reqClass = Class.query.filter(Class.key == key).one_or_none()
    if reqClass is None:
        return {"errors": ["The key your provided is invalid"],
                "invalidKey": True}
    request = EnrollmentRequest(studentId=current_user.id, classId=reqClass.id)
    db.session.add(request)
    note = Notification(
        message=f"{current_user.username} has requested to enroll in {reqClass.name}",
        forUserId=reqClass.ownerId,
        requestId=request.id
    )
    db.session.add(note)
    db.session.commit()
    return {"requestId": request.id}
