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
        winningNo_string = []
        for i in range (len(winningSoupList)):
            winningNo_string.append(winningSoupList[i].text)
        # Convert string to int 
        self.winningNo = [int(num_string) for num_string in winningNo_string]

        # Get Additional No. in a list
        self.additionalNo = [];
        self.additionalNo.append(int(soup.find(class_=re.compile("additional")).text))

        # receive cursor and execute the INSERT statement
    
    # If drawNo scrapped CONFLICT with drawNo in database, 
    # UPDATE the modified_date and numbers only
    def insert_into_database(self, cur):
        sql = """INSERT INTO \"TotoTable\" 
                    (date_drawn, draw_number, winning_number, additional_number, operator, date_modified) 
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (draw_number)
                    DO UPDATE SET 
                        date_modified = %s,
                        winning_number = %s,
                        additional_number = %s;"""
        # execute INSERT statement
        cur.execute(sql, (self.date, self.drawNo, self.winningNo, self.additionalNo, self.operator, 
            self.dateModified, self.dateModified, self.winningNo, self.additionalNo,))