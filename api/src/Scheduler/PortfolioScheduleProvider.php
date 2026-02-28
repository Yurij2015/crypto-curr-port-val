<?php
namespace App\Scheduler;

use App\Scheduler\Message\PortfolioSnapshotMessage;
use Psr\Log\LoggerInterface;
use Symfony\Component\Scheduler\Attribute\AsSchedule;
use Symfony\Component\Scheduler\Schedule;
use Symfony\Component\Scheduler\ScheduleProviderInterface;
use Symfony\Component\Scheduler\RecurringMessage;
use Symfony\Contracts\Cache\CacheInterface;

#[AsSchedule]
class PortfolioScheduleProvider implements ScheduleProviderInterface
{
    private ?Schedule $schedule = null;

    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly CacheInterface $cache
    ) {}

    public function getSchedule(): Schedule
    {
        $this->logger->info('Building hourly portfolio snapshot schedule');
        return $this->schedule ??= new Schedule()
            ->with(
                RecurringMessage::cron('0 * * * *', new PortfolioSnapshotMessage())
            )
            ->stateful($this->cache)
            ->processOnlyLastMissedRun(true);
    }
}
