# import libraries
from classes.fourD import FourD
from classes.toto import Toto
from classes.sweep import Sweep
from datetime import datetime
import psycopg2
import os
import settings

# create 4D and ToTo objects
fourD_URL = os.getenv("FOUR_D_URL")
toto_URL = os.getenv("TOTO_URL")
sweep_URL = os.getenv("SWEEP_URL")
newFourD = FourD()
newToTo = Toto()
newSweep = Sweep()
sg_operator = os.getenv("SG_OPERATOR")

# set and load 4D obj data
newFourD.operator = sg_operator
newFourD.scrap_data(fourD_URL)

# set and load TOTO obj data
newToTo.operator = sg_operator
newToTo.scrap_data(toto_URL)

# set and load SWEEP obj data
newSweep.operator = sg_operator
newSweep.scrap_data(sweep_URL)

# test variable
# newFourD.test_variables()
# newToTo.test_variables()
# newSweep.test_variables()


db_host = os.getenv("DATABASE_HOST")
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
    # insert sweep to database
    newSweep.insert_into_database(cur)

    # commit changes to database
    conn.commit()
    # close communication with database
    cur.close()
except (Exception, psycopg2.DatabaseError) as error:
    print(error)
finally:
    if conn is not None:
        conn.close()
