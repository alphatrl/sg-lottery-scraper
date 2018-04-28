# import libraries
from classes.fourD import FourD
from classes.toto import Toto
import os
import settings
from datetime import datetime

# create 4D and ToTo objects
fourD_URL = os.getenv("FOUR_D_URL")
toto_URL = os.getenv("TOTO_URL")
newFourD = FourD()
newToTo = Toto()


# set and load 4D obj data
newFourD.region = "SG"
newFourD.scrap_data(fourD_URL)
newFourD.test_variables()

# set and load TOTO obj data
newToTo.set_region = "SG"
newToTo.scrap_data(toto_URL)
newToTo.test_variables()

# TODO scrapper to postgresql