# Singapore Lottery Results Scrapper

This scrapes the lottery results from Singapore Pools using Python 3 and stores in a PostgreSQL database
(Singapore Pool url not included)

## Table of Contents

* [Motivation](#motivation)
* [Try It](#try-it)
* [Pre-requisites](#pre-requisites)
* [Installation](#installation)
* [Database Columns Description](#database-columns-description)
  * [FourDTable](#fourdtable)
  * [TotoTable](#tototable)
* [License](#license)

## Motivation

I saw my grandparents downloading a Lottery Results app and I realised that the UI sucks. So I thought to myself, it is possible to design a lottery results app which look good?

This provides a json file containing the latest results scrapped from Singapore Pools

## Try It

* [Web](http://sghuat.netlify.com)

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

[FourDTable.md](database_description/FourDTable.md)

### TotoTable

[TotoTable.md](database_description/TotoTable.md)

## License

[MIT LICENSE](LICENSE)