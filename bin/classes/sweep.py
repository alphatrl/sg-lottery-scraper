# import libraries
from .lottery import Lottery
from urllib.request import urlopen
from bs4 import BeautifulSoup
from datetime import datetime
import psycopg2 
import re

class Sweep(Lottery):

    # Init a Sweep obj
    def __init__(self):
        super().__init__()
        self.topThree = []
        self.jackpotPrize = []
        self.luckyPrize = []
        self.giftPrize = []
        self.consolationPrize = []
        self.participationPrize = []
        self.twoDPrize = []

    # Test variable
    def test_variables(self):
        super().test_variables()
        print(self.topThree)
        print(self.jackpotPrize)
        print(self.luckyPrize)
        print(self.giftPrize)
        print(self.consolationPrize)
        print(self.participationPrize)
        print(self.twoDPrize)


    # Scrap data from given url
    def scrap_data(self, url):
        sweep = urlopen(url)
        soup = BeautifulSoup(sweep, "html.parser")
        
        # use the latest sweep results
        for childSoup in soup.descendants:
            soup = childSoup
            break

        sweepList = soup.find_all(class_=re.compile("sweep-segment"))

        # Get date and convert to datetime
        drawDate = soup.find(class_="drawDate").text
        self.dateModified = datetime.now()
        self.date = datetime.strptime(drawDate, "%a, %d %b %Y")

        # Get the number end of the string through .split()
        drawNumberString = (soup.find(class_="drawNumber").text).split(" ")
        self.drawNo = drawNumberString[2]

        # Get SWEEP Top3 Prize in a List
        top3SoupList = soup.find_all(class_=re.compile("value"), limit=3)
        for i in range (len(top3SoupList)):
            self.topThree.append(int(top3SoupList[i].text))

        # Get Jackpot Prizes
        jackpotList = sweepList[1].find_all('li') # find all li in the list 2nd pos
        for i in range (len(jackpotList)):
            self.jackpotPrize.append(int(jackpotList[i].text))

        # Get Lucky Prizes
        luckyList = sweepList[2].find_all('li') # find all li in the list 3rd pos
        for i in range (len(luckyList)):
            self.luckyPrize.append(int(luckyList[i].text))

        # Get Gift Prizes
        giftList = sweepList[3].find_all('li') # find all li in the list 4th pos
        for i in range (len(giftList)):
            self.giftPrize.append(int(giftList[i].text))

        # Get Consolation Prizes
        consolationList = sweepList[4].find_all('li') # find all li in the list 5th pos
        for i in range (len(consolationList)):
            self.consolationPrize.append(int(consolationList[i].text))

        # Get Participation Prizes
        participationList = sweepList[5].find_all('li') # find all li in the list 6th pos
        for i in range (len(participationList)):
            self.participationPrize.append(int(participationList[i].text))

        # Get 2D Prizes
        twoDList = sweepList[6].find_all('li') # find all li in the list 7th pos
        for i in range (len(twoDList)):
            self.twoDPrize.append(int(twoDList[i].text))

    # receive cursor and execute the INSERT statement
    # If drawNo scrapped CONFLICT with drawNo in database, 
    # UPDATE the date only
    def insert_into_database(self, cur):
        sql = """INSERT INTO \"SweepTable\" 
                    (date_drawn, draw_number, top_three, jackpot_prize, lucky_prize, gift_prize,
                        consolation_prize, part_prize, twoD_prize, operator, date_modified) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (draw_number)
                    DO UPDATE SET date_modified = %s;"""
        # execute INSERT statement
        cur.execute(sql, (self.date, self.drawNo, self.topThree, self.jackpotPrize, self.luckyPrize,
            self.giftPrize, self.consolationPrize, self.giftPrize, self.twoDPrize,
            self.operator, self.dateModified, self.dateModified,))