# Singapore Lottery Results Scrapper

This scrapes the lottery results from Singapore Pools using Python 3 and stores in a PostgreSQL database
(Singapore Pool url not included)

## Table of Contents

* [Motivation](#motivation)
* [Pre-requisites](#Pre-requisites)
* [Installation](#Installation)
* [Database Columns Description](#Database_Columns_Description)
    * [FourDTable](#FourDTable)
    * [TotoTable](#TotoTable)
* [License](#LICENSE)

## Motivation

I saw my grandparents downloading a Lottery Results app and I realised that the UI sucks. So I thought to myself, it is possible to design a lottery results app which look good?

This provides a json file containing the latest results scrapped from Singapore Pools

## Pre-requisites

* Python 3
* PostgreSQL
* Gunicorn

Run in your terminal:

```bash
$pip3 install -r requirements.txt
```

## Installation

1. Using `pg_restore`, create a PostgreSQL database using the script in `/script/sg-lottery-db-template.sql`

1. Copy `.env.sample` and rename it to `.env`. Fill in the missing variables

1. Run `$ gunicorn app:app`

1. Set a daily scheduler to run the scrapper `$pip3 bin/scrapper.py`

## Database Columns Description

### FourDTable

#### date (datetime)

> The date when the numbers are drawn

#### draw_number (int)

> An index used by Singapore Pools for the draw

#### top_three (int[])

> An array containing the **winning numbers** for the 1st, 2nd and 3rd prizes for 4D. Sorted in order of 1st, 2nd and 3rd.

#### starter_number (int[])

> An array contaning the 10 **starter numbers** for the starter prizes. Order does not really matter

#### consolation_number (int[])

> An array contaning the 10 **consolation numbers** for the consolation prizes. Order does not really matter

#### operator (string)

> A string which contains the lottery operators' name. Singapore Pools is currently the only operator in Singapore. Other operators is used if there is a need to scrap lottery results from other countries

#### date_modified (datetime)

> Used if the data scrapped requires to be updated

### TotoTable

#### date (datetime)

> The date when the numbers are drawn

#### draw_number (int)

> An index used by Singapore Pools for the draw

#### winning_number (int[])

> An array containing the **winning numbers** for Toto

#### additional_number (int)

> An integer containing an the additional number for Toto

#### operator (string)

> A string which contains the lottery operators' name. Singapore Pools is currently the only operator in Singapore. Other operators is used if there is a need to scrap lottery results from other countries

#### date_modified (datetime)

> Used if the data scrapped requires to be updated

## License

[MIT LICENSE](LICENSE)