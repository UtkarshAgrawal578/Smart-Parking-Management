from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")

MONGO_URI = os.getenv("MONGO_URI")

print("MONGO_URI =", MONGO_URI)

client = MongoClient(MONGO_URI)

print("Databases:", client.list_database_names())

db = client["SmartParking"]
mcd_users = db["mcd_users"]
