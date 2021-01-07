from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Card, Deck
from datetime import datetime

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
