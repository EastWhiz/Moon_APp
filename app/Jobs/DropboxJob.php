<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Spatie\Browsershot\Browsershot;

class DropboxJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $data;
    public $timeout = 9999999999999999;
    public $tries = 2;
    public $user;
    public $print;

    /**
     * Create a new job instance.
     */
    public function __construct($user, $print)
    {
        $this->user = $user;
        $this->print = $print;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = $this->user;
        $print = $this->print;

        logger(json_encode($user));
        logger(json_encode($print));

        ini_set('memory_limit', '1G');
        ini_set('max_execution_time', 600);       // 600 seconds = 10 minutes
        ini_set('upload_max_filesize', '1024M'); // 1024 MB
        ini_set('post_max_size', '1024M');
        set_time_limit(600); // Set script execution time to 5 minutes

        Browsershot::url(env('APP_URL') . "/admin/render?design=$print->design&cityVisible=$print->cityVisible&dateVisible=$print->dateVisible&starsEffect=$print->starsEffect&title=$print->title&titleFont=$print->titleFont&paragraphText=$print->paragraphText&paragraphTextFont=$print->paragraphTextFont&selectedDate=$print->selectedDate&city=$print->city&titleFontSize=$print->titleFontSize&paragraphFontSize=$print->paragraphFontSize")
            ->waitUntilNetworkIdle()
            ->timeout(180000)
            ->waitForSelector('#allGoodToGo')
            ->select('#cardIdParent')
            ->setScreenshotType('jpeg', 100)
            ->deviceScaleFactor(4) // Mimics 300 DPI
            ->windowSize(9000, 5700)
            ->save('ss.jpeg');
    }
}
