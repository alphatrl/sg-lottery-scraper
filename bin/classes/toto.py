# import libraries
from .lottery import Lottery
from urllib.request import urlopen
from bs4 import BeautifulSoup
from datetime import datetime
import re

class Toto(Lottery):

    # Init a Toto obj
    def __init__(self):
        super().__init__()
        self.winningNo = []
        self.additionalNo = None

    ## Test variable
    def test_variables(self):
        super().test_variables()
        print(self.winningNo)
        print(self.additionalNo)

    # Scrap data from given url
    def scrap_data(self, url):
        fourD = urlopen(url)
        soup = BeautifulSoup(fourD, "html.parser")

        # Get date and convert to datetime
        drawDate = soup.find(class_="drawDate").text
        self.dateModified = datetime.now()
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

        # receive cursor and execute the INSERT statement
    
    # If drawNo scrapped CONFLICT with drawNo in database, 
    # UPDATE the date only

    def insert_into_database(self, cur):
        sql = """INSERT INTO \"FourDTable\" 
                    (date, \"drawNumber\", \"topThree\", \"starterNumber\", \"consolationNumber\", region) 
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (\"drawNumber\")
                    DO UPDATE SET date = %s;"""
        # execute INSERT statement
        cur.execute(sql, (self.date, self.drawNo, self.topThree, self.starterNo, self.consolationNo, self.region, self.date,))