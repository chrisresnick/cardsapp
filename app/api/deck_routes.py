from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Deck, Card
from datetime import datetime

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


@deck_routes.route("/<int:id>")
def getDeck(id):
    deck = Deck.query.get(id)
    return jsonify(deck.to_dict())


@deck_routes.route("/<int:id>/cards")
def getDeckCards(id):
    deck = Deck.query.get(id)
    return jsonify(deck.to_cards_dict())


@deck_routes.route("/<int:id>/due")
def getDeckCardsDue(id):
    cards = Card.query.filter(Card.deckId == id).filter(Card.nextShow <= datetime.now()).all()
    return {'cards': [card.to_dict() for card in cards]}

@deck_routes.route("/<int:id>/rename", methods=["POST"])
def renameDeck(id):
    deck = Deck.query.get(id)
    if deck.ownerId != current_user.id:
        return {"errors": ["You cannot add to a deck that you don't own"]}, 401
    name = request.json["name"]
    if not name:
        return {"errors": ["You must provide a name"]}
    deck.name = name
    db.session.commit()
    return {"name": name}
    
