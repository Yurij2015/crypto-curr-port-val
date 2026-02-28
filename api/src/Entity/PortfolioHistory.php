<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\Response;
use ApiPlatform\OpenApi\Model\Parameter;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/portfolio/history',
            routeName: 'app_portfolio_history',
            openapi: new Operation(
                responses: [
                    '200' => new Response(
                        description: 'Success',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    'type' => 'array',
                                    'items' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'time' => ['type' => 'string', 'format' => 'date-time'],
                                            'amount_usdt' => ['type' => 'number']
                                        ]
                                    ]
                                ]
                            ]
                        ])
                    )
                ],
                parameters: [
                    new Parameter(
                        name: 'hours',
                        in: 'query',
                        description: 'Filter records from the last X hours',
                        schema: [
                            'type' => 'integer',
                            'default' => 0
                        ]
                    ),
                    new Parameter(
                        name: 'from',
                        in: 'query',
                        description: 'Filter records from a specific ISO 8601 date',
                        schema: [
                            'type' => 'string',
                            'format' => 'date-time'
                        ]
                    ),
                    new Parameter(
                        name: 'to',
                        in: 'query',
                        description: 'Filter records until a specific ISO 8601 date',
                        schema: [
                            'type' => 'string',
                            'format' => 'date-time'
                        ]
                    )
                ]
            ),
            paginationEnabled: false
        )
    ]
)]
class PortfolioHistory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $calculatedAt;

    #[ORM\Column(type: 'decimal', precision: 18, scale: 8)]
    private string $amountUsdt;

    public function getId(): int
    {
        return $this->id;
    }

    public function getCalculatedAt(): \DateTimeImmutable
    {
        return $this->calculatedAt;
    }

    public function setCalculatedAt(\DateTimeImmutable $calculatedAt): self
    {
        $this->calculatedAt = $calculatedAt;
        return $this;
    }

    public function getAmountUsdt(): string
    {
        return $this->amountUsdt;
    }

    public function setAmountUsdt(string $amountUsdt): self
    {
        $this->amountUsdt = $amountUsdt;
        return $this;
    }
}
