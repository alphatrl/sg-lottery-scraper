# Main Application
# Purpose: Get records from the database and returns as a JSON

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
    cur = conn.cursor(cursor_factory=RealDictCursor)

except (Exception, psycopg2.DatabaseError) as error:
    print(error)
    # panic out

# pass a json containing all the 4D records
@app.route('/api/4d/')
def get_all_four_D():
 sql = "SELECT * FROM \"FourDTable\""
 cur.execute(sql)
 
 return json.dumps(cur.fetchall(), default=datetime_handler)

# pass a JSON containing the latest 4D results
@app.route('/api/4d/latest')
def get_latest_four_D():
 sql = """SELECT * FROM \"FourDTable\"
            ORDER BY draw_number DESC"""
 cur.execute(sql)
 
 return json.dumps(cur.fetchone(), default=datetime_handler)