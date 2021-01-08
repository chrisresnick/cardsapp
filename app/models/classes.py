from .db import db
from uuid import uuid4


class Class(db.Model):
    __tablename__ = "classes"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    ownerId = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    key = db.Column(db.String(36), unique=True, index=True, default=uuid4())

    owner = db.relationship("User", back_populates="classesOwned")
    students = db.relationship("User", secondary="enrollments", back_populates="classesEnrolled")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "ownerId": self.ownerId,
            "key": self.key,
            "numStudents": len(self.students)
        }


enrollment = db.Table(
    "enrollments",
    db.Model.metadata,
    db.Column("studentId", db.Integer, db.ForeignKey("users.id")),
    db.Column("classId", db.Integer, db.ForeignKey("classes.id"))
)
