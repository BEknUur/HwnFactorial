from sqlalchemy.orm import Session 
from app.models.task import Task
from app.schemas.task import TaskCreate

def create_task(db:Session,task:TaskCreate):
    db_task=Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task



def get_tasks(db:Session):
    return db.query(Task).all()
