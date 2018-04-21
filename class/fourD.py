# import libraries
from urllib.request import urlopen
from bs4 import BeautifulSoup
from datetime import datetime
import re

class FourD:

    # Init a FourD obj
    def __init__(self):
        self.date = None
        self.drawNo = None
        self.topThree = []
        self.starterNo = None
        self.consolationNo= None
        self.region = None
        self.url = None


    # Set methods
    def set_url(self, url):
        self.url = url

    def set_region(self, region):
        self.region = region


    # Scrap data from given url
    def scrap_data(self):
        fourD = urlopen(self.url)
        soup = BeautifulSoup(fourD, "html.parser")

        # Get date and convert to datetime
        drawDate = soup.find(class_="drawDate").text
        self.date = datetime.strptime(drawDate, "%a, %d %b %Y")

        # Get the number end of the string through .split()
        drawNumberString = (soup.find(class_="drawNumber").text).split(" ")
        self.drawNo = drawNumberString[2]

        # Get 4D Top3 Prize in a LIst
        top3SoupList = soup.find_all(class_=re.compile("Prize"), limit=3)
        for i in range (len(top3SoupList)):
            self.topThree.append(top3SoupList[i].text)

        # Get Starter Prizes
        starterList = soup.find(class_=re.compile("StarterPrize"))
        self.starterNo = (starterList.text).replace("\n"," ").split()

        # Get Consolation Prizes
        consolationList = soup.find(class_=re.compile("ConsolationPrize"))
        self.consolationNo = (consolationList.text).replace("\n"," ").split()