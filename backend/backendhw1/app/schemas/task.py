from pydantic import BaseModel

class TaskCreate(BaseModel):
    title:str
    description:str 



class TaskOut(TaskCreate):
    id:int

    class Config:
        orm_mode=True
        