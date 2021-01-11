from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Class, User, EnrollmentRequest, Notification, Card db


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
    newRequest = EnrollmentRequest(studentId=current_user.id, classId=reqClass.id)
    db.session.add(newRequest)
    db.session.commit()
    note = Notification(
        message=f"{current_user.username} has requested to enroll in {reqClass.name}",
        forUserId=reqClass.ownerId,
        forRequestId=newRequest.id
    )
    db.session.add(note)
    db.session.commit()
    return {"requestId": newRequest.id}


@class_routes.route("<int:id>/publish", methods=["POST"])
@login_required
def publish(id):
    class_ = Class.query.get(id)
    if class_.ownerId != current_user.id:
        return {"errors": ["You can't publish to a class you don't own!"]}
    deckId = request.json["deckId"]
    deck = Deck.query.get(deckId)
    for student in class_.students:
        newDeck = Deck(
            name=deck.name,
            ownerId=student.id
            classId=class_.id
        )
        for card in deck.cards:
            newDeck.cards.append(Card(
                question=card.question,
                answer=card.answer
            ))
        student.decks.append(newDeck)
    return {"success": True}
