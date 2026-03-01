<?php

namespace App\Scheduler\Handler;

use App\Scheduler\Message\PortfolioSnapshotMessage;
use App\Service\PortfolioValuationService;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
readonly class PortfolioSnapshotHandler
{
    public function __construct(
        private PortfolioValuationService $valuationService,
        private LoggerInterface $logger
    ) {
    }

    public function __invoke(PortfolioSnapshotMessage $message): void
    {
        $this->logger->info('Portfolio snapshot scheduled run started.');
        $this->valuationService->snapshotAllTraders();
        $this->logger->info('Portfolio snapshot scheduled run completed.');
    }
}
