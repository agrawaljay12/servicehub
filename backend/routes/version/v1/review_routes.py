from fastapi import APIRouter, Request,Depends
from core import http_status
from core import response 
from core.dependency import get_current_user
from controllers.review_controller import create_review,get_all_review_by_provider

router = APIRouter()

# test route
# URL:http://127.0.0.1:8000/api/v1/reviews/
# URL:http://127.0.0.1:8000/api/v1/reviews
# METHOD:GET
# description: Welcome to Reviews API Management

@router.get('/',response_description="Welcome to Reviews API Management")
async def booking_home():
    return response.success_response(
        status=http_status.OK,
        message="Welcome to Reviews API Management"
    )


# URL:http://127.0.0.1:8000/api/v1/reviews/create
# METHOD:POST   
# description: create review for completed booking only and also update provider average rating

@router.post('/create',response_description="Create Review")
async def Create_Review(request:Request,current_user: dict = Depends(get_current_user)):
    return await create_review(request,current_user)


# URL:http://127.0.0.1:8000/api/v1/reviews/fetch/provider/{provider_id}
# METHOD:GET 
# description: get all reviews for a provider by provider id

@router.get('/fetch/provider/{provider_id}',response_description="Fetch Reviews by Provider")
async def Fetch_Reviews_By_Provider(provider_id: str):
    return await get_all_review_by_provider(provider_id)