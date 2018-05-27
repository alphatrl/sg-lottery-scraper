# import libraries
from classes.fourD import FourD
from classes.toto import Toto
from datetime import datetime
import psycopg2
import os
import settings

# create 4D and ToTo objects
fourD_URL = os.getenv("FOUR_D_URL")
toto_URL = os.getenv("TOTO_URL")
newFourD = FourD()
newToTo = Toto()
sg_operator = os.getenv("SG_OPERATOR")

# set and load 4D obj data
newFourD.operator = sg_operator
newFourD.scrap_data(fourD_URL)
newFourD.test_variables()

# set and load TOTO obj data
newToTo.operator = sg_operator
newToTo.scrap_data(toto_URL)
newToTo.test_variables()

# TODO scrapper to postgresql
db_host = os.getenv("DATABASE_URL")
db_name = os.getenv("DATABASE_NAME")
db_user = os.getenv("DATABASE_USER")
db_password = os.getenv("DATABASE_PASSWORD")

# Connect to database
conn = None
try:
    # connect to PostgreSQL database
    conn = psycopg2.connect(host=db_host, database=db_name, user=db_user, password=db_password)
    # create a new cursor
    cur = conn.cursor()
    # insert fourD to database
    newFourD.insert_into_database(cur)
    # insert toto to database
    newToTo.insert_into_database(cur)
    # commit changes to database
    conn.commit()
    # close communication with database
    cur.close()
except (Exception, psycopg2.DatabaseError) as error:
    print(error)
finally:
    if conn is not None:
        conn.close()
