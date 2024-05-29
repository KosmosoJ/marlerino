import sqlalchemy
from sqlalchemy import Column, Integer, String, ForeignKey
from .database import Base
from sqlalchemy.orm import relationship

class ANetwork(Base):
    __tablename__ = 'anetworks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    ANet_name = Column(String, unique=True, nullable=False)
    keitaro_id = Column(Integer, nullable=True)
    children = relationship("Offer", back_populates="parent", lazy='joined')
    
    
class Offer(Base):
    __tablename__ = 'offers'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    ANet_id = Column(ForeignKey('anetworks.id'), nullable=False)
    name = Column(String, nullable=False, unique=True)
    payout_currency = Column(String, nullable=False)
    payout_value = Column(Integer,nullable=False)
    country = Column(String, nullable=False)
    state = Column(String,default='active')
    daily_cap = Column(Integer, nullable=False,default=0)
    keitaro_id = Column(Integer, nullable=True)
    parent = relationship("ANetwork", back_populates="children", lazy='joined')