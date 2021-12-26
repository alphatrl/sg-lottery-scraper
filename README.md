# SG-Lottery-Scraper

## Setup

```bash
yarn install
cp .env.example .env

# development
yarn dev:scrape # scrape lottery data
yarn dev:firebase #  push Firebase topics to subscribers

# production
yarn build
yarn start # scrape lottery data
yarn firebase #  push Firebase topics to subscribers
```

## Data

> The data from this project are based from the contents of these websites.

* [Singapore Pools (4D, Toto, Sweep)](https://online.singaporepools.com/en/lottery)
