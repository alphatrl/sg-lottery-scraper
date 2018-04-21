# import libraries
from urllib.request import urlopen
from bs4 import BeautifulSoup
from datetime import datetime
import re

fourD = urlopen("http://www.singaporepools.com.sg/DataFileArchive/Lottery/Output/fourd_result_top_draws_en.html")
soup = BeautifulSoup(fourD, "html.parser")

# Get date and convert to datetime
drawDate = soup.find(class_="drawDate").text
drawDate_datetime = datetime.strptime(drawDate, "%a, %d %b %Y")

# Get the number end of the string through .split()
drawNumberString = (soup.find(class_="drawNumber").text).split(" ")
drawNumber = drawNumberString[2]

# Get 4D Top3 Prize in a LIst
top3SoupList = soup.find_all(class_=re.compile("Prize"), limit=3)
top3List = []
for i in range (len(top3SoupList)):
    top3List.append(top3SoupList[i].text)

# Get Starter Prizes
starterList = soup.find(class_=re.compile("StarterPrize"))
starterPrize = (starterList.text).replace("\n"," ").split()

# Get Consolation Prizes
consolationList = soup.find(class_=re.compile("ConsolationPrize"))
consolationPrize = (consolationList.text).replace("\n"," ").split()

'''
print(drawDate_datetime)
print(drawNumber)
print(top3List)
print(starterPrize)
print(consolationPrize)
'''