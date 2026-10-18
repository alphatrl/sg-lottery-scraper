# SG-Lottery-Scraper

> [!IMPORTANT]
> **This project is archived and no longer maintained.**
>
> As of October 2026, this repository is read-only. No further updates, bug fixes, or
> dependency upgrades will be made, and the scraper may stop working if the source website
> changes. The code remains available for reference under the MIT license.

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
