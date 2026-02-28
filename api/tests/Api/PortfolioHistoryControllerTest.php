<?php

namespace App\Tests\Api;

use App\Entity\PortfolioHistory;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class PortfolioHistoryControllerTest extends WebTestCase
{
    private ?EntityManagerInterface $entityManager;
    private KernelBrowser $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->client = static::createClient();
        
        $this->entityManager = $this->client->getContainer()->get('doctrine')->getManager();
        
        $schemaTool = new SchemaTool($this->entityManager);
        $metadata = $this->entityManager->getMetadataFactory()->getAllMetadata();
        
        $schemaTool->dropSchema($metadata);
        $schemaTool->createSchema($metadata);
    }

    public function testGetHistory()
    {
        $history = new PortfolioHistory();
        $history->setAmountUsdt('1000.50');
        $history->setCalculatedAt(new \DateTimeImmutable());
        $this->entityManager->persist($history);
        $this->entityManager->flush();

        $this->client->request('GET', '/api/portfolio/history');

        $this->assertResponseIsSuccessful();
        $this->assertJson($this->client->getResponse()->getContent());

        $data = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertNotEmpty($data);
        $this->assertArrayHasKey('time', $data[0]);
        $this->assertArrayHasKey('amount_usdt', $data[0]);
        $this->assertEquals(1000.50, $data[0]['amount_usdt']);
    }

    public function testGetHistoryWithHours()
    {
        $oldHistory = new PortfolioHistory();
        $oldHistory->setAmountUsdt('500.00');
        $oldHistory->setCalculatedAt(new \DateTimeImmutable('-25 hours'));
        $this->entityManager->persist($oldHistory);

        $newHistory = new PortfolioHistory();
        $newHistory->setAmountUsdt('1500.00');
        $newHistory->setCalculatedAt(new \DateTimeImmutable('-1 hour'));
        $this->entityManager->persist($newHistory);

        $this->entityManager->flush();

        $this->client->request('GET', '/api/portfolio/history?hours=24');

        $this->assertResponseIsSuccessful();
        $data = json_decode($this->client->getResponse()->getContent(), true);
        
        // We expect only the recent record
        $this->assertCount(1, $data);
        $this->assertEquals(1500.00, $data[0]['amount_usdt']);
    }

    public function testGetHistoryWithDateRange()
    {
        $this->entityManager->createQuery('DELETE FROM App\Entity\PortfolioHistory')->execute();

        $date1 = new \DateTimeImmutable('2023-01-01 10:00:00');
        $date2 = new \DateTimeImmutable('2023-01-02 10:00:00');
        $date3 = new \DateTimeImmutable('2023-01-03 10:00:00');

        $h1 = new PortfolioHistory();
        $h1->setAmountUsdt('100.00');
        $h1->setCalculatedAt($date1);
        $this->entityManager->persist($h1);

        $h2 = new PortfolioHistory();
        $h2->setAmountUsdt('200.00');
        $h2->setCalculatedAt($date2);
        $this->entityManager->persist($h2);

        $h3 = new PortfolioHistory();
        $h3->setAmountUsdt('300.00');
        $h3->setCalculatedAt($date3);
        $this->entityManager->persist($h3);

        $this->entityManager->flush();

        $from = '2023-01-01T20:00:00';
        $to = '2023-01-02T20:00:00';
        
        $this->client->request('GET', "/api/portfolio/history?from=$from&to=$to");

        $this->assertResponseIsSuccessful();
        $data = json_decode($this->client->getResponse()->getContent(), true);
        
        $this->assertCount(1, $data);
        $this->assertEquals(200.00, $data[0]['amount_usdt']);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        if ($this->entityManager) {
            $this->entityManager->close();
            $this->entityManager = null;
        }
    }
}
