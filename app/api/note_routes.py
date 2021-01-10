from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Class, User, EnrollmentRequest, Notification, db

note_routes = Blueprint('note', __name__)


@note_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def deleteNote(id):
    note = Notification.query.get(id)
    if current_user.id != note.forUserId:
        return {"errors": ["You cannot delete someone else's note"]}
    db.session.delete(note)
    db.session.commit()
    return {"deleted": id}



@note_routes.route("/<int:id>/accept", methods=["POST"])
@login_required
def acceptRequest(id):
    note = Notification.query.get(id)
    if current_user.id != note.forUserId:
        return {"errors": ["You cannot respond to someone else's note"]}
    req = note.request
    student = req.student
    class_ = req.class_
    class_.students.append(student)
    addedNote = Notification(
        forUserId=student.id,
        message=f'You have been added to {class_.name}',
        noteType="approve")
    db.session.add(addedNote)
    db.session.delete(note)
    db.session.delete(req)
    db.session.commit()
    return {"sucess": f'{student.username} added to class'}
