from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User, Card, Deck, Notification
from datetime import datetime

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/<int:id>/decks')
def getUserDecks(id):
    # auth here
    user = User.query.get(id)
    return user.to_deck_list()


@user_routes.route('/<int:id>/navnums')
def getNavNums(id):
    numCardsToStudy = Card.query.join(Deck).filter(Deck.ownerId == id).filter(Card.nextShow <= datetime.now()).count()
    notes = Notification.query.filter(Notification.forUserId == id).all()
    return {
        "numCardsToStudy": numCardsToStudy
        "notes": [note.to_dict() for note in notes]
    }
