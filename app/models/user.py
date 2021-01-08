from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key = True)
  username = db.Column(db.String(40), nullable = False, unique = True)
  email = db.Column(db.String(255), nullable = False, unique = True)
  hashed_password = db.Column(db.String(255), nullable = False)

  notifications = db.relationship("Notification", back_populates="user")
  decks = db.relationship("Deck", back_populates="user")
  classesOwned = db.relationship("Class", back_populates="owner")
  classesEnrolled = db.relationship("Class", secondary="enrollments", back_populates="students")


  @property
  def password(self):
    return self.hashed_password


  @password.setter
  def password(self, password):
    self.hashed_password = generate_password_hash(password)


  def check_password(self, password):
    return check_password_hash(self.password, password)

  def to_dict(self):
    return {
      "id": self.id,
      "username": self.username,
      "email": self.email
    }
  def to_deck_list(self):
    return {
      "decks": [deck.to_dict() for deck in self.decks]
    }

  def to_classes_list(self):
    return {
      'owned': [c.to_dict() for c in self.classesOwned],
      'enrolled': [c.to_dict() for c in self.classesEnrolled]
    }
