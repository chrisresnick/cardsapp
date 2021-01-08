"""enrollment requests

Revision ID: c58027a13db5
Revises: 6fbc7d24fbf3
Create Date: 2021-01-08 13:20:49.322756

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c58027a13db5'
down_revision = '6fbc7d24fbf3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('enrollment_requests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('classId', sa.Integer(), nullable=True),
    sa.Column('studentId', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['classId'], ['classes.id'], ),
    sa.ForeignKeyConstraint(['studentId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('enrollment_requests')
    # ### end Alembic commands ###
