<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\Response;
use ApiPlatform\OpenApi\Model\Parameter;
use App\Controller\PortfolioHistoryController;

/**
 * @ORM\Entity
 */
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
            paginationEnabled: true
        )
    ]
)]
class PortfolioHistory
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"portfolio_history:read"})
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'datetime_immutable')]
    private \DateTimeImmutable $calculated_at;

    #[ORM\Column(type: 'decimal', precision: 18, scale: 8)]
    private string $amount_usdt;

    public function getId(): int
    {
        return $this->id;
    }

    public function getCalculatedAt(): \DateTimeImmutable
    {
        return $this->calculated_at;
    }

    public function setCalculatedAt(\DateTimeImmutable $calculated_at): self
    {
        $this->calculated_at = $calculated_at;
        return $this;
    }

    public function getAmountUsdt(): string
    {
        return $this->amount_usdt;
    }

    public function setAmountUsdt(string $amount_usdt): self
    {
        $this->amount_usdt = $amount_usdt;
        return $this;
    }
}
