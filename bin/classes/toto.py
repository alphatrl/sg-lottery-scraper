# import libraries
from urllib.request import urlopen
from bs4 import BeautifulSoup
from datetime import datetime
import re

class Toto:

    # Init a Toto obj
    def __init__(self):
        self.date = None
        self.drawNo = None
        self.winningNo = []
        self.additionalNo = None
        self.region = None

    ## Test variable
    def test_variables(self):
        print(self.date)
        print(self.drawNo)
        print(self.winningNo)
        print(self.additionalNo)
        print(self.region)

    # Scrap data from given url
    def scrap_data(self, url):
        fourD = urlopen(url)
        soup = BeautifulSoup(fourD, "html.parser")

        # Get date and convert to datetime
        drawDate = soup.find(class_="drawDate").text
        self.date = datetime.strptime(drawDate, "%a, %d %b %Y")

        # Get the draw number end of the string through .split()
        drawNumberString = (soup.find(class_="drawNumber").text).split(" ")
        self.drawNo = drawNumberString[2]

        # Get the Winning No. in a list
        winningSoupList = soup.find_all(class_=re.compile("win"), limit=6)
        for i in range (len(winningSoupList)):
            self.winningNo.append(winningSoupList[i].text)

        # Get Additional No.
        self.additionalNo = soup.find(class_=re.compile("additional")).text
