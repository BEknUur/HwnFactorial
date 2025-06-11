from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.session import get_db
from app.tasks.example import example_task

router = APIRouter()

@router.post("/")
def create_user(name: str, db: Session = Depends(get_db)):
   
    if db.query(User).filter(User.name == name).first():
        raise HTTPException(status_code=400, detail="User already exists")
    user = User(name=name)
    db.add(user)
    db.commit()
    db.refresh(user)

    
    example_task.delay(user.id)
    return user
