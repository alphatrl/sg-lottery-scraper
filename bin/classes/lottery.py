# import libraries
from urllib.request import urlopen
from bs4 import BeautifulSoup
from datetime import datetime
import re

class Lottery:

    # Init a FourD obj
    def __init__(self):
        self.date = None
        self.drawNo = None
        self.operator = None
        self.dateModified = None

    ## Test variable
    def test_variables(self):
        print(self.date)
        print(self.drawNo)
        print(self.operator)
        print(self.dateModified)