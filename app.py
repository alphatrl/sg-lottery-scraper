# Main Application
# Purpose: Get records from the database and returns as a JSON

# import libraries
import json
import psycopg2
import os
import datetime
from flask import Flask
from psycopg2.extras import RealDictCursor
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db_host = os.getenv("DATABASE_HOST")
db_name = os.getenv("DATABASE_NAME")
db_user = os.getenv("DATABASE_USER")
db_password = os.getenv("DATABASE_PASSWORD")

# handle datetime for python to json


def datetime_handler(x):
  if isinstance(x, datetime.datetime):
    return x.isoformat()
  raise TypeError("Unknown type")


try:
  # connect to PostgreSQL database
  conn = psycopg2.connect(host=db_host, database=db_name,
                          user=db_user, password=db_password)
  cur = conn.cursor(cursor_factory=RealDictCursor)

except (Exception, psycopg2.DatabaseError) as error:
  print(error)
  # panic out

# pass a JSON containing all the 4D records
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


# pass a JSON containing all the TOTO records
@app.route('/api/toto/')
def get_all_toto():
  sql = "SELECT * FROM \"TotoTable\""
  cur.execute(sql)

  return json.dumps(cur.fetchall(), default=datetime_handler)

# pass a JSON containing the latest Toto results
@app.route('/api/toto/latest')
def get_latest_toto():
  sql = """SELECT * FROM \"TotoTable\"
          ORDER BY draw_number DESC"""
  cur.execute(sql)

  return json.dumps(cur.fetchone(), default=datetime_handler)


# pass a JSON containing all the SWEEP records
@app.route('/api/sweep/')
def get_all_sweep():
  sql = "SELECT * FROM \"SweepTable\""
  cur.execute(sql)

  return json.dumps(cur.fetchall(), default=datetime_handler)

# pass a JSON containing the latest Sweep results
@app.route('/api/sweep/latest')
def get_latest_sweep():
  sql = """SELECT * FROM \"SweepTable\"
          ORDER BY draw_number DESC"""
  cur.execute(sql)

  return json.dumps(cur.fetchone(), default=datetime_handler)

  # pass a JSON containing the latest results (4D, TOTO, Sweep)
@app.route('/api/latest')
def get_latest():
  # declare dictionary
  json_data = {}

  sql_fourd = """SELECT * FROM \"FourDTable\"
          ORDER BY draw_number DESC"""
  sql_toto = """SELECT * FROM \"TotoTable\"
          ORDER BY draw_number DESC"""
  sql_sweep = """SELECT * FROM \"SweepTable\"
        ORDER BY draw_number DESC"""

  cur.execute(sql_fourd)
  json_data["fourD"] = cur.fetchone()

  cur.execute(sql_toto)
  json_data["toto"] = cur.fetchone()

  cur.execute(sql_sweep)
  json_data["sweep"] = cur.fetchone()
  
  return json.dumps(json_data, default=datetime_handler)


if __name__ == '__main__':
  app.run(port=os.getenv("PORT"))
