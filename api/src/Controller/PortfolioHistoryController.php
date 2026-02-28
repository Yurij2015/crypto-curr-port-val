<?php

namespace App\Controller;

use App\Entity\PortfolioHistory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;

#[AsController]
class PortfolioHistoryController extends AbstractController
{
    /**
     * @throws \DateMalformedStringException
     */
    #[Route('/api/portfolio/history', name: 'app_portfolio_history', methods: ['GET'])]
    public function history(Request $request, EntityManagerInterface $em): Response
    {
        $hours = $request->query->getInt('hours', 0);
        $from = $request->query->get('from');
        $to = $request->query->get('to');

        $qb = $em->getRepository(PortfolioHistory::class)->createQueryBuilder('h');

        if ($hours > 0) {
            $fromDate = new \DateTimeImmutable('-' . $hours . ' hours');
            $qb->andWhere('h.calculatedAt >= :from')->setParameter('from', $fromDate);
        } elseif ($from && $to) {
            $qb->andWhere('h.calculatedAt >= :from')->setParameter('from', new \DateTimeImmutable($from));
            $qb->andWhere('h.calculatedAt <= :to')->setParameter('to', new \DateTimeImmutable($to));
        }

        $qb->orderBy('h.calculatedAt', 'ASC');
        $results = $qb->getQuery()->getResult();

        $data = array_map(fn(PortfolioHistory $h) => [
            'time' => $h->getCalculatedAt()->format('Y-m-d\TH:i:s\Z'),
            'amount_usdt' => (float)$h->getAmountUsdt()
        ], $results);

        return new JsonResponse($data);
    }
}
