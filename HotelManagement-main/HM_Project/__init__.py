from flask import Flask
from flask_restful import Api,Resource
from .resource.registration import Registration
from .resource.booking import Booking
from HM_Project.database import DataBase
from HM_Project.config import postgresqlConfig
import json
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#app.config['SQLALCHEMY_DATABASE_URI'] = postgresqlConfig

@app.route('/')
def getname():
   return "Hello"

api = Api(app)

@app.before_first_request
def create_tables():
  
     DataBase.CreateTable()

@app.route('/register', methods = ['POST'])
def registration_fun() :
     registerinstance = Registration()
     return registerinstance.insert_Customerdata()


@app.route('/login',methods = ['POST'])
def login_fun():
    registerinstance = Registration()
    return registerinstance.getLoginInfo()


@app.route('/booking',methods = ['POST'])
def booking_fun():
    booking = Booking()
    return booking.insertBookingdata()

@app.route('/getbookinginfo',methods = ['POST'])
def getbookinginfo():
    booking = Booking()
    return booking.getCustomerInfo()

@app.route('/getdatabybookingid',methods = ['POST'])
def getinfobybookingid():
    booking = Booking()
    return booking.getBookingIdInfo()

@app.route('/cancelbooking',methods = ['POST'])
def cancelbooking():
    booking = Booking()
    return booking.cancelbooking()


