<?php

namespace App\Command;

use App\Service\PortfolioValuationService;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:portfolio:snapshot',
    description: 'Take a snapshot of all traders portfolio valuations'
)]
class PortfolioSnapshotCommand extends Command
{
    public function __construct(
        private readonly PortfolioValuationService $valuationService,
        private readonly LoggerInterface $logger
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $this->logger->info('Portfolio snapshot command started');
        
        $this->valuationService->snapshotAllTraders();

        $this->logger->info('Portfolio snapshot command finished');
        $io->success('Portfolio snapshot command finished');
        return Command::SUCCESS;
    }
}
