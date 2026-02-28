# API

The API will be here.

Refer to the [Getting Started Guide](https://api-platform.com/docs/distribution) for more information.

## Seeding Default Trader and Portfolio

To seed the database with a default trader and portfolio, run the following command in your PHP container:

```
docker compose exec php php bin/console doctrine:fixtures:load --no-interaction
```

This will create a trader with the following portfolio:
- 1 BTC
- 10 ETH
- 50 SOL
- 5000 USDT
