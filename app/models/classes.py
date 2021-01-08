from .db import db


class Class(db.Model):
    __tablename__ = "classes"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    ownerId = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    owner = db.relationship("User", back_populates="classesOwned")
    students = db.relationship("User", secondary="enrollments", back_populates="classesEnrolled" )


enrollment = db.Table(
    "enrollments",
    db.Model.metadata,
    db.Column("studentId", db.Integer, db.ForeignKey("users.id")),
    db.Column("classId", db.Integer, db.ForeignKey("classes.id"))
)
