from flask import Flask
from AdminSDK.admin import FirebaseServer

app = Flask(__name__)

serverApp = FirebaseServer()
