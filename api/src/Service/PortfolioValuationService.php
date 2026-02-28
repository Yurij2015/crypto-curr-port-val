<?php

namespace App\Service;

use App\Entity\Trader;
use App\Entity\PortfolioHistory;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

readonly class PortfolioValuationService
{
    public function __construct(
        private BinancePriceService $binancePriceService,
        private EntityManagerInterface $em,
        private LoggerInterface $logger
    ) {
    }

    /**
     * Calculate and store hourly portfolio value in PortfolioHistory for all traders
     */
    public function snapshotAllTraders(): void
    {
        $traders = $this->em->getRepository(Trader::class)->findAll();
        if (!$traders) {
            $this->logger->warning('No traders found for portfolio snapshot');

            return;
        }

        foreach ($traders as $trader) {
            $amounts = [
                'BTC' => 0.0,
                'ETH' => 0.0,
                'SOL' => 0.0,
                'USDT' => 0.0,
            ];
            foreach ($trader->getPortfolios() as $portfolio) {
                $asset = strtoupper($portfolio->getAsset());
                if (isset($amounts[$asset])) {
                    $amounts[$asset] = (float)$portfolio->getAmount();
                }
            }
            $history = $this->snapshotHourlyPortfolio($amounts);
            if ($history) {
                $this->logger->info('Portfolio snapshot saved', [
                    'trader' => $trader->getName(),
                    'amount_usdt' => $history->getAmountUsdt(),
                    'calculated_at' => $history->getCalculatedAt()->format('c'),
                ]);
            } else {
                $this->logger->error('Failed to save portfolio snapshot', ['trader' => $trader->getName()]);
            }
        }
    }

    /**
     * Calculate and store hourly portfolio value in PortfolioHistory
     */
    public function snapshotHourlyPortfolio(array $amounts): ?PortfolioHistory
    {
        $assets = ['BTC', 'ETH', 'SOL', 'USDT'];
        $total = 0.0;
        foreach ($assets as $asset) {
            $symbol = $asset.'USDT';
            if ($asset === 'USDT') {
                $price = 1.0;
            } else {
                $price = $this->binancePriceService->getAvgPrice($symbol);
            }
            if ($price === null) {
                $this->logger->error('Failed to fetch avgPrice for asset', ['asset' => $asset]);

                return null;
            }
            $amount = isset($amounts[$asset]) ? (float)$amounts[$asset] : 0.0;
            $value = $amount * $price;
            $this->logger->info('Asset hourly valuation', [
                'asset' => $asset,
                'amount' => $amount,
                'price' => $price,
                'value' => $value,
            ]);
            $total += $value;
        }
        $history = new PortfolioHistory();
        $history->setCalculatedAt(new \DateTimeImmutable());
        $history->setAmountUsdt((string)$total);
        $this->em->persist($history);
        $this->em->flush();
        $this->logger->info('Hourly portfolio snapshot stored', ['amount_usdt' => $total]);

        return $history;
    }
}
