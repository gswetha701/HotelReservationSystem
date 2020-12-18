import psycopg2
from flask_restful import Resource
from flask import jsonify
import psycopg2.extensions
import json
from random import randint
import psycopg2.extras
import json
import datetime

class DataBase(Resource):
    
 @classmethod
 def CreateTable(self):
 
  try:
    connection = psycopg2.connect(database = "postgres",
                                  user = "postgre",
                                  password = "postgresql",
                                  host = "db-hotel-management.c6i7hzivudlm.us-east-2.rds.amazonaws.com",
                                  port = "5432"
                                  )

    cur = connection.cursor()

    if(self.table_exists(connection,"db_registration")):
   
     cur.execute('''CREATE TABLE db_registration
      (ID SERIAL PRIMARY KEY,
      first_name     TEXT     NOT NULL,
      last_name      TEXT     NOT NULL,
      user_name      TEXT     NOT NULL,
      password       TEXT     NOT NULL,
      email          TEXT     NOT NULL,
      phone_no       TEXT     NOT NULL,
      address        TEXT     NOT NULL,
      country        TEXT     NOT NULL,
      postal_code    TEXT     NOT NULL,
      role           TEXT     NOT NULL,
      unique_id      TEXT     NOT NULL);''')

     cur.execute("""INSERT INTO db_registration (first_name,last_name,user_name,password,email,phone_no,address,country,postal_code,role,unique_id)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",("Admin","Dreamz","admin","admin@123","admin@sereneneuk.ac.uk","0227894556","heathrow","UK","IG11 8FW","admin","1"))

     
    if(self.table_exists(connection,"db_guest")):
   
     cur.execute('''CREATE TABLE db_guest
      (ID SERIAL PRIMARY KEY,
      first_name     TEXT     NOT NULL,
      last_name      TEXT     NOT NULL,
      email          TEXT     NOT NULL,
      phone_no       TEXT     NOT NULL,
      address        TEXT     NOT NULL,
      country        TEXT     NOT NULL,
      booking_id     TEXT       NOT NULL,
      postal_code    TEXT     NOT NULL);''')
   

    if(self.table_exists(connection,"db_roombooking")):
      cur.execute('''CREATE TABLE db_roombooking
      (ID SERIAL PRIMARY KEY,
      unique_id      TEXT,
      adults         varchar(255)     NOT NULL,
      children        varchar(255)     NOT NULL,
      rooms           varchar(255)     NOT NULL,
      check_in       TEXT     NOT NULL,
      check_out      TEXT     NOT NULL,
      days            varchar(255)     NOT NULL,
      location       TEXT      NOT NULL,
      room_type      TEXT      NOT NULL,
      confirm_status      TEXT  NOT NULL,
      payment_status      TEXT  NOT NULL,
      booking_id     TEXT       NOT NULL,
      first_name     TEXT     NOT NULL,
      last_name      TEXT     NOT NULL,
      email          TEXT     NOT NULL,
      phone_no       TEXT     NOT NULL,
      price_rate     TEXT  NOT NULL);''')

    connection.commit()
    cur.close()
    connection.close()

  except (Exception, psycopg2.Error) as error :
    print ("Error while connecting to PostgreSQL", error)
  finally:
    #closing database connection.
        if(connection):
           cur.close()
           connection.close()
           print("PostgreSQL connection is closed")


 def checkConnection(self):
     conn = psycopg2.connect(database = "postgres",
                                  user = "postgre",
                                  password = "postgresql",
                                  host = "db-hotel-management.c6i7hzivudlm.us-east-2.rds.amazonaws.com",
                                  port = "5432"
                                  )
     return conn

 def table_exists(dbcon, tablename):
    exists = False
    try:
       dbcur = dbcon.cursor()
       dbcur.execute("""
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_name = '{0}'
        """.format(tablename.replace('\'', '\'\'')))
       if dbcur.fetchone()[0] == 1:
        exists = True
        dbcur.close()
        return False
       dbcur.close()
       return True
    except psycopg2.Error as e:
        print (e)
        return exists


 def insertCustomerData(self,args):
     first_name = args['first_name']
     last_name = args['last_name']
     password = args['password']
     user_name = args['user_name']
     email = args['email']
     phone_no = args['phone_no']
     address = args['address']
     country = args['country']
     postal_code = args['postal_code']
     unique_id = self.generaterandomNumber()
     query = """INSERT INTO db_registration (first_name,last_name,user_name,password,email,phone_no,address,country,postal_code,role,unique_id) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id """
     insertdata = (first_name,last_name,user_name,password,email,phone_no,address,country,postal_code,"user",unique_id)
     insertval = self.insertQuery(query,insertdata)
     status = {"status": "1", "id": insertval}
     return jsonify(status)

 def checkCount(self,table,where):
     conn = self.checkConnection()
     cursor = conn.cursor()
     query = "select count(*) from "+ table + " where "+ where
     print(query)
     #query = "select count(*) from db_registration where email = 'joefreeda.30@gmail.com'"
     #cursor.execute(query,(inputdata,))
     cursor.execute(query)
     insertvalue = cursor.fetchone()[0]
     cursor.close()
     conn.commit()
     conn.close()
     return insertvalue

 def generaterandomNumber(self):
     return randint(100, 999)

 def insertQuery(self,query,insertdata):
     conn = self.checkConnection()
     cursor = conn.cursor()
     cursor.execute(query,insertdata)
     insertvalue = cursor.fetchone()[0]
     cursor.close()
     conn.commit()
     conn.close()
     return insertvalue

 def getLoginInfo(self,args) :
     password = args['password']
     email = args['email']
     query = "select json_agg(t) from (select * from db_registration where email = %s and password = %s)  t"
     #query = """select json_agg(t) from (select * from db_registration,db_roombooking  where (case when (select role from db_registration where db_registration.email = %s and db_registration.password = %s)='admin' then db_registration.unique_id = db_roombooking.unique_id else db_registration.email = %s	and db_registration.password = %s and  db_registration.unique_id = db_roombooking.unique_id  END) ) t"""
     #query = "select * from db_registration where email = %s and password = %s"
     insertValue = (email,password)
     customerdata = self.selectQuery(query,insertValue)
     print(customerdata)
     return jsonify(customerdata)

 def selectQuery(self,query,insertdata):
     conn = self.checkConnection()
     #cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
     cursor = conn.cursor()
     cursor.execute(query,insertdata)
     insertvalue = cursor.fetchall()[0]
     cursor.close()
     conn.commit()
     conn.close()
     return insertvalue[0]

 def selectwithoutreturn(self,query,insertdata):
     conn = self.checkConnection()
     cursor = conn.cursor()
     cursor.execute(query,insertdata)
     cursor.close()
     conn.commit()
     conn.close()




 def insertBookingData(self,args):
     bookingId = self.generaterbookingId()
    
     query = """INSERT INTO db_roombooking (unique_id,adults,children,rooms,check_in,check_out,
     days,location,room_type,confirm_status,payment_status,booking_id,price_rate,first_name,last_name,email,phone_no) 
     VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING booking_id"""
     insertdata = (args['unique_id'],args['adults'],args['children'],args['rooms'],
                   args['check_in'],args['check_out'],
                   args['days'],args['location'],args['room_type'],args['confirm_status'],
                   args['payment_status'],bookingId,args['price_rate'],args['first_name'],
                   args['last_name'],args['email'],args['phone_no'])
     self.insertQuery(query,insertdata)

     if(args['unique_id'] == '0'):
       query = """INSERT INTO db_guest (first_name,last_name,email,phone_no,address,
       country,booking_id,postal_code)VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING ID"""
       insertdata = (args['first_name'],args['last_name'],args['email'],args['phone_no'],
                   args['address'],args['country'],bookingId,
                   args['postal_code'])
       self.insertQuery(query,insertdata)
     status = {"status": "1","Booking Id" : bookingId}
     return jsonify(status)

 def generaterbookingId(self):
     return randint(10000, 99999)


 def getDatabyLoginId(self,args):
     if(args['role']=='admin'):
          query = "select json_agg(t) from (select * from db_registration INNER JOIN db_roombooking on (db_registration.unique_id = db_roombooking.unique_id) where db_registration.role = 'user')  t"
     else :
          query = "select json_agg(t) from (select * from db_roombooking where unique_id = %s)  t"
     insertValue = (args['unique_id'],)
     customerdata = self.selectQuery(query,insertValue)
     return jsonify(customerdata)

 def getDatabyBookingId(self,args):
     #query = "select json_agg(t) from (SELECT * FROM db_roombooking INNER JOIN db_guest ON (db_roombooking.booking_id = db_guest.booking_id) where db_roombooking.booking_id  = %s)  t"
     query = "select json_agg(t) from (SELECT * FROM db_roombooking where booking_id = %s) t"
     insertValue = (args['booking_id'],)
     customerdata = self.selectQuery(query,insertValue)
     return jsonify(customerdata)

 def cancelbooking(self,args):
     query = "update db_roombooking set confirm_status = %s where booking_id = %s"
     insertValue = ("Cancelled",args['booking_id'],)
     self.selectwithoutreturn(query,insertValue)
     status = {"status": "1"}
     return jsonify(status)








 