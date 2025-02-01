<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Spatie\Browsershot\Browsershot;
use Illuminate\Support\Str;

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

    // Function to generate a random string (equivalent to generateRandomString in JS)
    public function generateRandomString($length = 20)
    {
        return Str::random($length); // Use Laravel's Str::random() to generate a random string
    }

    public function createSharedLink($accessToken, $path)
    {
        $url = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';

        try {

            $response = Http::withHeaders([
                'Authorization' => "Bearer $accessToken",
                'Content-Type' => 'application/json',
            ])->post($url, [
                'path' => $path,
            ]);

            if ($response->successful()) {
                return $response->json();
            } else {
                throw new \Exception('Error uploading file 2: ' . $response->json()['error']);
            }
        } catch (\Exception $e) {
            return response()->json(['error 2' => $e->getMessage()], 500);
        }
    }

    // Function to refresh Dropbox access token using the refresh token
    public function refreshDropboxToken()
    {
        $appKey = 'gvdrwbzb0rldf1y'; // Replace with your Dropbox App Key
        $appSecret = 'zxrlikjbureuenx'; // Replace with your Dropbox App Secret
        $credentials = base64_encode("{$appKey}:{$appSecret}");

        try {
            $response = Http::withHeaders([
                'Authorization' => "Basic {$credentials}",
                'Content-Type' => 'application/x-www-form-urlencoded',
            ])
                ->asForm()
                ->post('https://api.dropboxapi.com/oauth2/token', [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => 'AnSuRjmiX1YAAAAAAAAAAQdxoff23v9E1BKrvXAwFHX3VGZFbL-nFyTxT3F4OqOj',
                ]);

            if ($response->successful()) {
                // Access token can be accessed like this
                return $response->json()['access_token'];
            } else {
                throw new \Exception($response->json()['error_description'] ?? 'Failed to refresh token');
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Function to handle file upload to Dropbox
    public function uploadFileToDropbox($imageName)
    {
        
        $accessToken = $this->refreshDropboxToken(); // Get the access token using refresh token

        if (!$accessToken) {
            return response()->json(['error' => 'Unable to obtain access token'], 500);
        }

        // $base64Image = $request->input('base64image');

        // // Remove base64 header if present
        // if (strpos($base64Image, 'base64,') !== false) {
        //     [$meta, $base64Image] = explode('base64,', $base64Image);
        // }

        // // Decode and validate image
        // $imageData = base64_decode($base64Image);
        // if (!$imageData || !imagecreatefromstring($imageData)) {
        //     return response()->json(['error' => 'Invalid image data'], 400);
        // }

        // Generate a random string for the file path
        $dropboxPath = "/Moonora/$imageName"; // Customize the path if needed

        try {

            $filePath = storage_path("app/public/screenshots/$imageName"); // Path to your file
            $imageData = file_get_contents($filePath); // Get the binary content of the file

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$accessToken}",
                'Content-Type' => 'application/octet-stream',
                'Dropbox-API-Arg' => json_encode([
                    'path' => $dropboxPath,
                    'mode' => 'add', // Add mode (change to 'overwrite' if needed)
                    'autorename' => true, // To avoid conflicts with the same file name
                ]),
            ])
                ->timeout(3600) // Set timeout to 5 minutes
                ->withBody($imageData, 'application/octet-stream') // Attach the binary data
                ->post('https://content.dropboxapi.com/2/files/upload');

            if ($response->successful()) {
                $result = $response->json();
                $path = $result['path_display'];
                $internalResponse = $this->createSharedLink($accessToken, $path);
                return $internalResponse['url'];
            } else {
                throw new \Exception('Error uploading file: ' . $response->json()['error']);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $print = $this->print;

        // logger(json_encode($user));
        // logger(json_encode($print));



        $url = env('APP_URL') . '/admin/render?' . http_build_query([
            'design' => $print->design,
            'cityVisible' => $print->cityVisible,
            'dateVisible' => $print->dateVisible,
            'starsEffect' => $print->starsEffect,
            'title' => $print->title,
            'titleFont' => $print->titleFont,
            'paragraphText' => $print->paragraphText,
            'paragraphTextFont' => $print->paragraphTextFont,
            'selectedDate' => $print->selectedDate,
            'city' => $print->city
        ]);

        // logger($url);

        $screenshotsDirectory = storage_path('app/public/screenshots');
        $imageName = Str::random(20);

        // $consoleMessages = Browsershot::url($url)
        // ->setNodeModulePath('/home/1380969.cloudwaysapps.com/uavphvarpc/node_modules') // Puppeteer node_modules path
        // ->setChromePath('/usr/bin/google-chrome') // Path to Chrome binary
        // ->waitUntilNetworkIdle()
        // ->setEnvironmentOptions([
        //     'CHROME_CONFIG_HOME' => '/home/1380969.cloudwaysapps.com/uavphvarpc/public_html/temp-puppeteer'
        // ])->timeout(60)
        // ->debug()->consoleMessages();
        // logger(json_encode($consoleMessages));

        Browsershot::url($url)
        ->setNodeModulePath('/home/1380969.cloudwaysapps.com/uavphvarpc/node_modules') // Puppeteer node_modules path
        ->setChromePath('/usr/bin/google-chrome') // Path to Chrome binary
        // ->noSandbox()
        // ->ignoreHttpsErrors()
        // ->waitUntilNetworkIdle()
        ->setEnvironmentOptions([
            'CHROME_CONFIG_HOME' => '/home/1380969.cloudwaysapps.com/uavphvarpc/public_html/temp-puppeteer'
        ])
        ->timeout(3600)
        ->protocolTimeout(3600)
        ->waitForSelector('#allGoodToGo')
        ->select('#cardIdParent')
        ->setScreenshotType('jpeg', 100)
        ->deviceScaleFactor(4) // Mimics 300 DPI
        // ->windowSize(9000, 5700)
        ->windowSize(8600, 5400)
        ->save($screenshotsDirectory . "/$imageName.jpeg");

        sleep(1);
        $link = $this->uploadFileToDropbox("$imageName.jpeg");
        // logger($link);

        $print->update([
            'status' => "processed",
            'link' => $link
        ]);

        if (Storage::disk('public')->exists("screenshots/$imageName.jpeg")) {
            Storage::disk('public')->delete("screenshots/$imageName.jpeg");
        }
    }
}
