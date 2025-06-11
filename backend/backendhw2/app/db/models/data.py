from sqlalchemy import Column,Integer,String,DateTime,JSON
from app.db.session import Base 

class DataRecord(Base):
    __tablename__="data_records"

    id=Column(Integer,primary_key=True,index=True)
    timestamp=Column(DateTime,nullable=False)
    content=Column(JSON,nullable=False)
    