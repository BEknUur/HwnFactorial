from fastapi import APIRouter,HTTPException
from sqlmodel import Session,select 

from app.db.session import engine
 
from app.models.task import Task,TaskCreate,TaskRead

router=APIRouter()


@router.on_event("startup")

def init_db():
    Task.metadata.create_all(engine)



def get_session():
    with Session(engine) as s:
        yield s




@router.post("/tasks",response_model=TaskRead,status_code=201)
def create_task(payload:TaskCreate):
    with Session(engine )as s :
        task=Task.from_orm(payload)
        s.add(task)
        s.commit()
        s.refresh(task)
        return task
    




@router.get("/tasks",response_model=list[TaskRead])
def read_tasks():
    with Session(engine) as s:
        return s.exec(select(Task)).all()
    



@router.put("/tasks/{task_id}",response_model=TaskRead)

def update_task(task_id:int,payload:TaskCreate):
    with Session(engine) as s:
        task=s.get(Task,task_id)
        if not task:
            raise HTTPException(404,"Task not found")
        
        for k,v in payload.dict().items():
            setattr(task,k,v)
        
        s.add(task)
        s.commit()
        s.refresh(task)
        return task
    

@router.delete("/tasks/{task_id}",status_code=204)
def delete_task(task_id:int):
    with Session(engine) as s:
        task=s.get(Task,task_id)
        if not task:
            raise HTTPException(404,"Task not found")
        s.delete(task)
        s.commit()
        