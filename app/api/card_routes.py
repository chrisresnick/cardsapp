from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Card, Deck
from datetime import datetime, timedelta
from .deck_routes import getDeckCardsDue

card_routes = Blueprint('card', __name__)


@card_routes.route("/<int:id>", methods=["PUT"])
def editCard(id):
    card = Card.query.get(id)
    if card.deck.ownerId != current_user.id:
        return {"errors": ["You cannot edit a card you dont own"]}, 401
    card.question = request.json['question'] or card.question
    card.answer = request.json['answer'] or card.answer
    db.session.commit()
    return card.to_dict()


@card_routes.route("/due")
def getCardsDueNow():
    cards = Card.query.join(Deck).filter(Deck.ownerId == current_user.id).filter(Card.nextShow <= datetime.now()).all()
    return {'cards': [card.to_dict() for card in cards]}

@card_routes.route("/study", methods=["POST"])
def studyUpdate():
    cardId = request.json["cardId"]
    card = Card.query.get(cardId)
    difficulty = request.json["difficulty"]
    now = datetime.now()
    if difficulty == 4:
        card.nextShow = now
    elif difficulty == 3:
        card.nextShow = now + timedelta(minutes=1)
    elif difficulty == 2:
        card.nextShow = now + timedelta(minutes=10)
    elif difficulty == 1:
        card.nextShow = now + timeDelta(hours=1)
    else:
        card.nextShow = now + timeDelta(days=1)
    db.session.commit()
    deckId = request.json['deckId']
    return getCardsDueNow() if deckId == 'None' else getDeckCardsDue()
