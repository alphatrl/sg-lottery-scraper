# Singapore Lottery Results Scrapper

This scrapes the lottery results from Singapore Pools using Python 3 and stores in a PostgreSQL database
(Singapore Pool url not included)

## Motivation

I saw my grandparents downloading a Lottery Results app and I realised that the UI sucks. So I thought to myself, it is possible to design a lottery results app which look good?

To turn this app to a reality, we would first need to scrap and store the lottery results somewhere.

## Pre-requisites

- Python 3
- PostgreSQL

## Installation

1. Using `pg_restore`, create a PostgreSQL database using the script in `/script/create-db-sg-lottery.sql`

(TBC...)