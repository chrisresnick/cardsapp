from .db import db
from datetime import datetime


class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    forUserId = db.Column(db.Integer, db.ForeignKey("users.id"), index=True)
    forRequestId = db.Column(db.Integer, db.ForeignKey("enrollment_requests.id"))
    noteType = db.Column(db.Enum("request", "approve", "deny", name="typeName"), default="request")
    seen = db.Column(db.Boolean, default=False)
    createdAt = db.Column(db.DateTime, default=datetime.now())

    user = db.relationship("User", back_populates="notifications")
    request = db.relationship("EnrollmentRequest", backref="notification")
