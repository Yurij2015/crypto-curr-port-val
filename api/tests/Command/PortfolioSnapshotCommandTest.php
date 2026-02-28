<?php

namespace App\Tests\Command;

use App\Command\PortfolioSnapshotCommand;
use App\Service\PortfolioValuationService;
use PHPUnit\Framework\TestCase;
use Psr\Log\NullLogger;
use Symfony\Component\Console\Tester\CommandTester;

class PortfolioSnapshotCommandTest extends TestCase
{
    public function testExecute()
    {
        $valuationService = $this->createMock(PortfolioValuationService::class);
        $logger = new NullLogger();

        $valuationService->expects($this->once())
            ->method('snapshotAllTraders');

        $command = new PortfolioSnapshotCommand($valuationService, $logger);
        $tester = new CommandTester($command);
        
        $tester->execute([], ['decorated' => false]);
        
        $tester->assertCommandIsSuccessful();
        
        $output = $tester->getDisplay();
        $this->assertStringContainsString('Portfolio snapshot command finished', $output);
    }
}
