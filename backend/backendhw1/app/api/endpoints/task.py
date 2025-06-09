from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.schemas.task import TaskCreate,TaskOut
from app.crud.task import get_tasks,create_task
from app.db.session import get_db 
from typing import List

router=APIRouter()

@router.post("/",response_model=TaskOut)
def create(task:TaskCreate,db:Session=Depends(get_db)):
    return create_task(db,task)


@router.get("/",response_model=List[TaskOut])
def read_all(db:Session=Depends(get_db)):
    return get_tasks(db)
