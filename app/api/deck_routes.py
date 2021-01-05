from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Deck, Card

deck_routes = Blueprint('deck', __name__)


@deck_routes.route("/", methods=["POST"])
@login_required
def createDeck():
    name = request.json["name"]
    owner = current_user.id
    newDeck = Deck(name=name, ownerId=owner)
    db.session.add(newDeck)
    db.session.commit()
    return jsonify(newDeck.to_dict())


@deck_routes.route("/<int:id>/cards", methods=["POST"])
@login_required
def addCard(id):
    deck = Deck.query.get(id)
    question = request.json["question"]
    answer = request.json["answer"]
    if deck.ownerId != current_user.id:
        return {"errors": ["You cannot add to a deck that you don't own"]}, 401
    newCard = Card(deckId=deck.id, question=question, answer=answer)
    deck.cards.append(newCard)
    db.session.commit()
    return jsonify(newCard.to_dict())
