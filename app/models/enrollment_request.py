from .db import db


class EnrollmentRequest(db.Model):
    __tablename__ = "enrollment_requests"
    id = db.Column(db.Integer, primary_key=True)
    classId = db.Column(db.Integer, db.ForeignKey("classes.id"))
    studentId = db.Column(db.Integer, db.ForeignKey("users.id"))

    student = db.relationship("User", backref="requests")
    class_ = db.relationship("Class", backref="requests")
