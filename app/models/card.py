from .db import db
from datetime import datetime


class Card(db.Model):
    __tablename__ = "cards"
    id = db.Column(db.Integer, primary_key=True)
    deckId = db.Column(db.Integer, db.ForeignKey("decks.id"), nullable=False)
    question = db.Column(db.String, nullable=False)
    answer = db.Column(db.String, nullable=False)
    nextShow = db.Column(db.DateTime, default=datetime.now())

    deck = db.relationship("Deck", back_populates="cards")

    def to_dict(self):
        return {
            "id": self.id,
            "deckId": self.deckId,
            "question": self.question,
            "answer": self.answer,
            "nextShow": self.nextShow
        }
