"""added models

Revision ID: 3797cf5890a7
Revises: 
Create Date: 2024-05-29 14:27:06.593486

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3797cf5890a7'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('anetworks',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('ANet_name', sa.String(), nullable=False),
    sa.Column('keitaro_id', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('ANet_name')
    )
    op.create_table('offers',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('ANet_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('payout_currency', sa.String(), nullable=False),
    sa.Column('payout_value', sa.Integer(), nullable=False),
    sa.Column('country', sa.String(), nullable=False),
    sa.Column('state', sa.String(), nullable=True),
    sa.Column('daily_cap', sa.Integer(), nullable=False),
    sa.Column('keitaro_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['ANet_id'], ['anetworks.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('offers')
    op.drop_table('anetworks')
    # ### end Alembic commands ###
