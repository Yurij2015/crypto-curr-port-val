# API

The API will be here.

Refer to the [Getting Started Guide](https://api-platform.com/docs/distribution) for more information.

## Seeding Default Trader and Portfolio

To seed the database with a default trader and portfolio:

### Local Development

Run the following command:

```bash
docker compose exec php php bin/console doctrine:fixtures:load --no-interaction
```

### Production (Remote Server)

```bash
cd /home/yurii/crypto-curr-port-val/current
docker compose -p crypto-app -f compose.yaml -f compose.prod.yaml exec php php bin/console doctrine:fixtures:load --no-interaction
```

### Portfolio Data

This will create a trader with the following portfolio:
- 1 BTC
- 10 ETH
- 50 SOL
- 5000 USDT

## Portfolio Snapshot Command

To manually create a portfolio valuation snapshot:

### Local Development

```bash
docker compose exec php php bin/console app:portfolio:snapshot
```

### Production (Remote Server)

```bash
cd /home/yurii/crypto-curr-port-val/current
docker compose -p crypto-app -f compose.yaml -f compose.prod.yaml exec php php bin/console app:portfolio:snapshot
```

This command calculates the current total value of all traders' portfolios and saves the snapshot to the `portfolio_history` table.
