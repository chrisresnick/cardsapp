from .db import db
from datetime import datetime


class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    forUserId = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    forRequestId = db.Column(db.Integer, db.ForeignKey("enrollment_requests.id"))
    forDeckId = db.Column(db.Integer, db.ForeignKey("decks.id"))
    noteType = db.Column(db.Enum("request", "approve", "deny", "deck", name="noteType"), default="request")
    seen = db.Column(db.Boolean, default=False)
    createdAt = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship("User", back_populates="notifications")
    request = db.relationship("EnrollmentRequest", backref="notification")

    def to_dict(self):
        return {
            "id": self.id,
            "message": self.message,
            "noteType": self.noteType,
            "seen": self.seen,
            "createdAt": self.createdAt
        }
