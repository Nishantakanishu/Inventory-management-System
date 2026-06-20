from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional

class CustomerBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr = Field(..., max_length=255)
    phone_number: Optional[str] = Field(None, max_length=50)

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "full_name": "John Doe",
                "email": "john@example.com",
                "phone_number": "9999999999",
                "created_at": "2026-06-20T14:25:01Z",
                "updated_at": "2026-06-20T14:25:01Z"
            }
        }
