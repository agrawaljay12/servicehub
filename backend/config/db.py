from pymongo import MongoClient

client = MongoClient('mongodb+srv://agrawaljay247_db_user:<agrawaljay247_db_user>@cluster0.bdgppsl.mongodb.net/?appName=Cluster0')

db = client['smart_local_services']

