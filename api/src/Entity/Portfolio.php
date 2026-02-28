<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Entity\Trader;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity]
class Portfolio
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'string', length: 10)]
    private string $asset;

    #[ORM\Column(type: 'decimal', precision: 18, scale: 8)]
    private string $amount;

    #[ORM\ManyToOne(targetEntity: Trader::class, inversedBy: 'portfolios')]
    #[ORM\JoinColumn(nullable: false)]
    private Trader $trader;

    public function getId(): int
    {
        return $this->id;
    }

    public function getAsset(): string
    {
        return $this->asset;
    }

    public function setAsset(string $asset): self
    {
        $this->asset = $asset;
        return $this;
    }

    public function getAmount(): string
    {
        return $this->amount;
    }

    public function setAmount(string $amount): self
    {
        $this->amount = $amount;
        return $this;
    }

    public function getTrader(): Trader
    {
        return $this->trader;
    }

    public function setTrader(Trader $trader): self
    {
        $this->trader = $trader;
        return $this;
    }
}
