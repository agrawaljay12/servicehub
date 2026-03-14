from pydantic import BaseModel


class Provider(BaseModel):
    user_id:str
    service_category_id:str
    location:str
    experience:str
    price:str   
    rating:str
    description:str
    provider_status:str
    created_at:str
    proof_document:str
