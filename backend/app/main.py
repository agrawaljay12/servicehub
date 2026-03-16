from dotenv import load_dotenv
from app.server import create_server
from app.routes_register import register_routes

# Load environment variables FIRST before importing routes
load_dotenv()

app = create_server()
register_routes(app)
