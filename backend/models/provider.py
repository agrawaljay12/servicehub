from pydantic import BaseModel
from typing import Optional

class Provider(BaseModel):
    user_id:str
    service_category_id:str
    location:str
    experience:str
    price:str   
    rating:Optional[float] = "0"
    description:str
    provider_status:str ="pending"
    created_at:str
    proof_document:str
