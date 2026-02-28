<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;

readonly class BinancePriceService
{
    public function __construct(
        private HttpClientInterface $httpClient,
        private LoggerInterface $logger
    ) {
    }

    /**
     * Fetch price for a given symbol from Binance
     */
    public function getPrice(string $symbol): ?float
    {
        $url = 'https://api.binance.com/api/v3/ticker/price?symbol='.strtoupper($symbol);
        $this->logger->info('Requesting Binance price', ['url' => $url, 'symbol' => $symbol]);
        try {
            $response = $this->httpClient->request('GET', $url);
            $status = $response->getStatusCode();
            $content = $response->getContent(false);
            $this->logger->info('Binance response', ['status' => $status, 'content' => $content]);
            if ($status !== 200) {
                $this->logger->error('Non-200 response from Binance', ['status' => $status]);

                return null;
            }
            $data = json_decode($content, true);
            if (!isset($data['price'])) {
                $this->logger->error('Price not found in Binance response', ['response' => $data]);

                return null;
            }
            $this->logger->info('Successfully fetched Binance price', ['symbol' => $symbol, 'price' => $data['price']]);

            return (float)$data['price'];
        } catch (\Throwable $e) {
            $this->logger->error('Error fetching Binance price', ['exception' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Fetch average price for a given symbol from Binance
     */
    public function getAvgPrice(string $symbol): ?float
    {
        $url = 'https://api.binance.com/api/v3/avgPrice?symbol='.strtoupper($symbol);
        $this->logger->info('Requesting Binance avgPrice', ['url' => $url, 'symbol' => $symbol]);
        try {
            $response = $this->httpClient->request('GET', $url);
            $status = $response->getStatusCode();
            $content = $response->getContent(false);
            $this->logger->info('Binance avgPrice response', ['status' => $status, 'content' => $content]);
            if ($status !== 200) {
                $this->logger->error('Non-200 response from Binance avgPrice', ['status' => $status]);

                return null;
            }
            $data = json_decode($content, true);
            if (!isset($data['price'])) {
                $this->logger->error('Price not found in Binance avgPrice response', ['response' => $data]);

                return null;
            }
            $this->logger->info(
                'Successfully fetched Binance avgPrice',
                ['symbol' => $symbol, 'price' => $data['price']]
            );

            return (float)$data['price'];
        } catch (\Throwable $e) {
            $this->logger->error('Error fetching Binance avgPrice', ['exception' => $e->getMessage()]);

            return null;
        }
    }
}
