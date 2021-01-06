from .db import db


class Deck(db.Model):
    __tablename__ = "decks"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    ownerId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    shareType = db.Column(db.Enum("private", "public", "shared", name="shareOption"), default="public")
    readOnly = db.Column(db.Boolean, default=False)

    cards = db.relationship("Card", back_populates="deck")
    user = db.relationship("User", back_populates="decks")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "owner": self.ownerId,
            "share": self.shareType,
            "readOnly": self.readOnly,
            "numCards": len(self.cards)
        }

    def to_cards_dict(self):
        return {
            "id": self.id,
            "cards": [card.to_dict() for card in self.cards]
        }
