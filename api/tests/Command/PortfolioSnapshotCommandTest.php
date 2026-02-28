<?php

namespace App\Tests\Command;

use App\Command\PortfolioSnapshotCommand;
use App\Service\PortfolioValuationService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Tester\CommandTester;

class PortfolioSnapshotCommandTest extends TestCase
{
    public function testExecuteNoTraders()
    {
        $valuationService = $this->createMock(PortfolioValuationService::class);
        $em = $this->createMock(EntityManagerInterface::class);
        $logger = $this->createMock(LoggerInterface::class);
        $repo = $this->getMockBuilder('Doctrine\\Persistence\\ObjectRepository')->getMock();
        $repo->method('findAll')->willReturn([]);
        $em->method('getRepository')->willReturn($repo);

        $command = new PortfolioSnapshotCommand($valuationService, $em, $logger);
        $tester = new CommandTester($command);
        $tester->execute([]);
        $output = $tester->getDisplay();
        $this->assertStringContainsString('No traders found.', $output);
    }

    public function testExecuteWithTraders()
    {
        $valuationService = $this->createMock(PortfolioValuationService::class);
        $em = $this->createMock(EntityManagerInterface::class);
        $logger = $this->createMock(LoggerInterface::class);
        $trader = $this->getMockBuilder('App\\Entity\\Trader')->disableOriginalConstructor()->getMock();
        $trader->method('getName')->willReturn('TestTrader');
        $valuationService->method('getTotalValue')->willReturn(123.45);
        $repo = $this->getMockBuilder('Doctrine\\Persistence\\ObjectRepository')->getMock();
        $repo->method('findAll')->willReturn([$trader]);
        $em->method('getRepository')->willReturn($repo);

        $command = new PortfolioSnapshotCommand($valuationService, $em, $logger);
        $tester = new CommandTester($command);
        $tester->execute([]);
        $output = $tester->getDisplay();
        $this->assertStringContainsString('Trader "TestTrader" portfolio value: 123.45 USDT', $output);
    }
}

