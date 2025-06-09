from sqlmodel import SQLModel,Field
from typing import Optional


class TaskBase(SQLModel):
    title:str
    description:Optional[str]=None
    done:bool=False


class Task(TaskBase,table=True):
    id:Optional[int]=Field(default=None,primary_key=True)



class TaskCreate(TaskBase):
    pass 


class TaskRead(TaskBase):
    id:int