from core import http_status
from core import message
import re 
from fastapi import HTTPException

def validate_data_all_required_field(data:dict):

    # extract fields 
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone_no = data.get("phone_no")
    address = data.get("address")

    # --------------------------validations logic for fields ----------------------------
    # validation for all required fields
    if not name or not email or not password or not phone_no or not address:
        raise HTTPException(
            status_code=http_status.BAD_REQUEST,
            detail = message.REQUIRED_FIELDS_MISSING
        )
        
#-------------------------- validation for individual fields-----------------------------

def validate_name(name:str):
    # validate name format
    if not name.replace(" ","").isalpha():
        raise HTTPException(
            status_code=http_status.BAD_REQUEST,
            detail=message.INVALID_NAME_FORMAT
        )
        
def validate_email(email:str):
    # validate email format
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
        raise HTTPException(
            status_code=http_status.BAD_REQUEST,
            detail=message.INVALID_EMAIL_FORMAT
        )
    
def validate_password(password:str):
    # validate password format
    password_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Z][A-Za-z\d\W_]{7,15}$'
    if not re.match(password_pattern, password):
        raise HTTPException(
            status_code=http_status.BAD_REQUEST,
            detail=message.INVALID_PASSWORD_FORMAT
        )
def validate_phone(phone_no:str):        
    phone_no_pattern = r'^\+\d{1,3}\d{7,14}$'
    if not re.match(phone_no_pattern, phone_no):
        raise HTTPException(
            status_code=http_status.BAD_REQUEST,
            detail=message.INVALID_PHONE_FORMAT
        )

def validate_address(address:str):
    address_pattern = r'^[A-Za-z0-9\/\-\,\s]+,\s[A-Za-z\s]+,\s[A-Za-z\s]+,\s[A-Za-z\s]+,\s\d{6}$'
    if not re.match(address_pattern, address):
        raise HTTPException(
            status_code=http_status.BAD_REQUEST,
            detail=message.INVALID_ADDRESS_FORMAT
        )