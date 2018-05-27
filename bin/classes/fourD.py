# import libraries
from .lottery import Lottery
from urllib.request import urlopen
from bs4 import BeautifulSoup
from datetime import datetime
import psycopg2 
import re

class FourD(Lottery):

    # Init a FourD obj
    def __init__(self):
        super().__init__()
        self.topThree = []
        self.starterNo = None
        self.consolationNo= None

    # Test variable
    def test_variables(self):
        super().test_variables()
        print(self.topThree)
        print(self.starterNo)
        print(self.consolationNo)

    # Scrap data from given url
    def scrap_data(self, url):
        fourD = urlopen(url)
        soup = BeautifulSoup(fourD, "html.parser")

        # Get date and convert to datetime
        drawDate = soup.find(class_="drawDate").text
        self.dateModified = datetime.now()
        self.date = datetime.strptime(drawDate, "%a, %d %b %Y")

        # Get the number end of the string through .split()
        drawNumberString = (soup.find(class_="drawNumber").text).split(" ")
        self.drawNo = drawNumberString[2]

        # Get 4D Top3 Prize in a List
        top3SoupList = soup.find_all(class_=re.compile("Prize"), limit=3)
        for i in range (len(top3SoupList)):
            self.topThree.append(int(top3SoupList[i].text))

        # Get Starter Prizes
        starterList = soup.find(class_=re.compile("StarterPrize"))
        starterNo_string = (starterList.text).replace("\n"," ").split()
        # Convert string to int 
        self.starterNo = [int(num_string) for num_string in starterNo_string]

        # Get Consolation Prizes
        consolationList = soup.find(class_=re.compile("ConsolationPrize"))
        consolationNo_string = (consolationList.text).replace("\n"," ").split()
        # Convert string to int 
        self.consolationNo = [int(num_string) for num_string in consolationNo_string]

    # receive cursor and execute the INSERT statement
    # If drawNo scrapped CONFLICT with drawNo in database, 
    # UPDATE the date only
    def insert_into_database(self, cur):
        sql = """INSERT INTO \"FourDTable\" 
                    (date, draw_number, top_three, starter_number, consolation_number, operator, date_modified) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (draw_number)
                    DO UPDATE SET date_modified = %s;"""
        # execute INSERT statement
        cur.execute(sql, (self.date, self.drawNo, self.topThree, self.starterNo, self.consolationNo, self.operator, 
            self.dateModified, self.dateModified,))