from config.db import db 
from models.provider import Provider
from core import response
from core import http_status
from bson import ObjectId
from datetime import datetime
from fastapi import UploadFile, File, Form, Depends
from utility.file_upload import save_file
from core.dependency import get_current_user

# define the provider collection
provider_collection = db['providers']
service_category_collection = db['service_category']


# create a new provider
async def create_provider(
    service_category_id: str = Form(...),
    location: str = Form(...),
    experience: str = Form(...),
    price: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user) 
):
    try:
        # check if the service category exists
        service_category = service_category_collection.find_one({"_id": ObjectId(service_category_id)})

        # if service category does not exist, return an error response
        if not service_category:
            return response.error_response("Service category not found", status=http_status.NOT_FOUND)
    

        user_id = current_user.get("user_id") or str(current_user.get("_id"))

        # save the uploaded file and get its path
        proof_document_path = await save_file(file, "provider")

        # create a new provider document
        provider = Provider(
            user_id=user_id,
            service_category_id=service_category_id,
            location=location,
            experience=experience,
            price=price,
            description=description,
            created_at=datetime.utcnow().isoformat(),
            proof_document=proof_document_path
        )

        result = provider_collection.insert_one(provider.dict())

        return response.success_response("Provider created successfully", {"id": str(result.inserted_id)}, status=http_status.CREATED)
    except Exception as e:
        return response.error_response(str(e), status=http_status.INTERNAL_SERVER_ERROR)

# list all provider based on status =="approved"
async def get_all_Provider():
    try:
        providers =[]

        result = provider_collection.find({"provider_status":"approved"})

        for provider in result:

            provider["_id"] = str(provider["_id"])
            providers.append(provider)
            
        return response.success_response(
            message = "Providers retrieved successfully",
            data = providers,
            status = http_status.OK 
        )
    except Exception as e:
        return response.error_response(
            message= str(e), 
            status=http_status.INTERNAL_SERVER_ERROR
        )