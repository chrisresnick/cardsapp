"""notifications tablename

Revision ID: cdbe3de95563
Revises: c5e70ea2a555
Create Date: 2021-01-08 13:41:30.650351

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'cdbe3de95563'
down_revision = 'c5e70ea2a555'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('notifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('forUserId', sa.Integer(), nullable=True),
    sa.Column('forRequestId', sa.Integer(), nullable=True),
    sa.Column('noteType', sa.Enum('request', 'approve', 'deny', name='type'), nullable=True),
    sa.Column('seen', sa.Boolean(), nullable=True),
    sa.Column('createdAt', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['forRequestId'], ['enrollment_requests.id'], ),
    sa.ForeignKeyConstraint(['forUserId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notifications_forUserId'), 'notifications', ['forUserId'], unique=False)
    op.drop_index('ix_notification_forUserId', table_name='notification')
    op.drop_table('notification')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('notification',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('message', sa.TEXT(), autoincrement=False, nullable=False),
    sa.Column('forUserId', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('forRequestId', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('noteType', postgresql.ENUM('request', 'approve', 'deny', name='type'), autoincrement=False, nullable=True),
    sa.Column('seen', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.Column('createdAt', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['forRequestId'], ['enrollment_requests.id'], name='notification_forRequestId_fkey'),
    sa.ForeignKeyConstraint(['forUserId'], ['users.id'], name='notification_forUserId_fkey'),
    sa.PrimaryKeyConstraint('id', name='notification_pkey')
    )
    op.create_index('ix_notification_forUserId', 'notification', ['forUserId'], unique=False)
    op.drop_index(op.f('ix_notifications_forUserId'), table_name='notifications')
    op.drop_table('notifications')
    # ### end Alembic commands ###