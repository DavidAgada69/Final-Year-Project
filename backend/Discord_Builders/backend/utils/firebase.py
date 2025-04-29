import firebase_admin
from firebase_admin import credentials, auth

# --- Initialize Firebase Admin ---
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
