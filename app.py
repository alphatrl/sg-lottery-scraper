# import libraries
import json
import psycopg2
import os
import datetime
from flask import Flask
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

database_host = os.getenv("DATABASE_URL")
database_name = os.getenv("DATABASE_NAME")

# handle datetime for python to json
def datetime_handler(x):
    if isinstance(x, datetime.datetime):
        return x.isoformat()
    raise TypeError("Unknown type")

try:
    # connect to PostgreSQL database
    conn = psycopg2.connect(host=database_host,database=database_name)
except (Exception, psycopg2.DatabaseError) as error:
    print(error)
    # panic out

@app.route('/api/4d')
def four_D():
 
 cur = conn.cursor(cursor_factory=RealDictCursor)
 sql = "SELECT * FROM \"FourDTable\""
 cur.execute(sql)
 
 return json.dumps(cur.fetchall(), default=datetime_handler)
