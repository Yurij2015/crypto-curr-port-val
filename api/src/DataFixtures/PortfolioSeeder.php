<?php
namespace App\DataFixtures;

use App\Entity\Trader;
use App\Entity\Portfolio;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PortfolioSeeder extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $trader = new Trader();
        $trader->setName('Default Trader');
        $manager->persist($trader);

        $assets = [
            ['asset' => 'BTC', 'amount' => '1'],
            ['asset' => 'ETH', 'amount' => '10'],
            ['asset' => 'SOL', 'amount' => '50'],
            ['asset' => 'USDT', 'amount' => '5000'],
        ];

        foreach ($assets as $data) {
            $portfolio = new Portfolio();
            $portfolio->setAsset($data['asset']);
            $portfolio->setAmount($data['amount']);
            $portfolio->setTrader($trader);
            $manager->persist($portfolio);
        }

        $manager->flush();
    }
}
