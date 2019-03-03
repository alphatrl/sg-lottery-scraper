# File to test whether scrapping of variables work without
# adding anything to database

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
print('\n4D')
newFourD.operator = sg_operator
newFourD.scrap_data(fourD_URL)
newFourD.test_variables()

# # set and load TOTO obj data
print('\nToto')
newToTo.operator = sg_operator
newToTo.scrap_data(toto_URL)
newToTo.test_variables()

# set and load SWEEP obj data
print('\nSweep')
newSweep.operator = sg_operator
newSweep.scrap_data(sweep_URL)
newSweep.test_variables()
