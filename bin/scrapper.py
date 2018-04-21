# import libraries
from classes.fourD import FourD
import os
import settings
from datetime import datetime

fourD_URL = os.getenv("FOUR_D_SG_URL")
newFourD = FourD()
newFourD.set_url(fourD_URL)
newFourD.set_region("SG")
newFourD.scrap_data()
newFourD.test_variables()