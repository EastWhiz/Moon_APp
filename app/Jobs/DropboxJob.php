<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DropboxJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $data;
    public $timeout = 9999999999999999;
    public $tries = 2;
    public $user;
    public $orderPrint;

    /**
     * Create a new job instance.
     */
    public function __construct($user, $orderPrint)
    {
        $this->user = $user;
        $this->orderPrint = $orderPrint;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = $this->user;
        $orderPrint = $this->orderPrint;

        logger(json_encode($user));
        logger(json_encode($orderPrint));
    }
}
