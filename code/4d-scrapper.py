# import libraries
from urllib.request import urlopen
from bs4 import BeautifulSoup
from datetime import datetime
import re

fourD = urlopen("http://www.singaporepools.com.sg/DataFileArchive/Lottery/Output/fourd_result_top_draws_en.html")
soup = BeautifulSoup(fourD, "html.parser")

# create a new BeautifulSoup obj which contains the most recent 4D results
recentResult = soup.find_all(class_="tables-wrap", limit=1)
recentResultSoup =  BeautifulSoup(fourD, "html.parser")
# print(recentResult)

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
    # print(top3List[i])

# Get Starter Prizes
starterList = soup.find(class_=re.compile("StarterPrize"))
starterPrize = (starterList.text).replace("\n"," ").split()
# print(starterPrize)

# Get Consolation Prizes
consolationList = soup.find(class_=re.compile("ConsolationPrize"))
consolationPrize = (consolationList.text).replace("\n"," ").split()
# print(consolationPrize)