from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Deck, Card

deck_routes = Blueprint('deck', __name__)


@login_required
@deck_routes.route("/", methods=["POST"])
def createDeck():
    name = request.json["name"]
    owner = current_user.id
    newDeck = Deck(name=name, ownerId=owner)
    db.session.add(newDeck)
    db.session.commit()
    return jsonify(newDeck.to_dict())

@deck_routes.route("/<int:id>/cards", methods=["POST"])
def addCard(id):
    pass
