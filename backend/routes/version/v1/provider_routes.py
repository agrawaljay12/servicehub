from controllers.provider_controller import create_provider,get_all_approved_Provider,get_all_pending_Provider
from fastapi import APIRouter, Depends, UploadFile, File, Form,status
from core.dependency import get_current_user,get_required_role
from fastapi.responses import JSONResponse

router = APIRouter()

# URL: http://127.0.0.1:8000/api/v1/provider/
# method: GET
# description : WELCOME TO API HOME 

@router.get('/',response_description="Welcome to the Provider Management API")
async def home():
    return JSONResponse(
        status_code= status.HTTP_200_OK,
        content={"message": "Welcome to the Provider Management API"}

    )

# URL: http://127.0.0.1:8000/api/v1/provider/create
# method: POST
# description : CREATE A NEW PROVIDER

@router.post('/create',response_description="Create a new provider")
async def create_provider_endpoint(
    service_category_id: str = Form(...),
    location: str = Form(...),
    experience: str = Form(...),
    price: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user) 
):
    return await create_provider(
        service_category_id=service_category_id,
        location=location,
        experience=experience,
        price=price,
        description=description,
        file=file,
        current_user=current_user
    )

# URL: http://127.0.0.1:8000/api/v1/provider/fetch_all/approved
# method: GET
# description : fetch all providers based on status =="approved"

@router.get('/fetch_all/approved',response_description="Fetch all approved providers")
async def fetch_all_providers_endpoint():
    return await get_all_approved_Provider()

# URL: http://127.0.0.1:8000/api/v1/provider/fetch_all/pending
# method: GET
# description : fetch all providers based on status =="pending"

@router.get('/fetch_all/pending',response_description="Fetch all pending providers",dependencies=Depends(get_required_role(['admin'])))
async def fetch_all_providers_endpoint():
    return await get_all_pending_Provider()

