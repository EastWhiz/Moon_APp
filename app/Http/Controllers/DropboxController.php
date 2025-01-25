<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class DropboxController extends Controller
{
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
    public function uploadFileToDropbox(Request $request)
    {
        ini_set('memory_limit', '1G');
        set_time_limit(300); // Set script execution time to 5 minutes

        $accessToken = $this->refreshDropboxToken(); // Get the access token using refresh token

        if (!$accessToken) {
            return response()->json(['error' => 'Unable to obtain access token'], 500);
        }

        $base64Image = $request->input('base64image');

        // Remove base64 header if present
        if (strpos($base64Image, 'base64,') !== false) {
            [$meta, $base64Image] = explode('base64,', $base64Image);
        }

        // Decode and validate image
        $imageData = base64_decode($base64Image);
        if (!$imageData || !imagecreatefromstring($imageData)) {
            return response()->json(['error' => 'Invalid image data'], 400);
        }

        // Generate a random string for the file path
        $dropboxPath = '/Moonora/' . $this->generateRandomString() . '.png'; // Customize the path if needed

        try {

            $response = Http::withHeaders([
                'Authorization' => "Bearer {$accessToken}",
                'Content-Type' => 'application/octet-stream',
                'Dropbox-API-Arg' => json_encode([
                    'path' => $dropboxPath,
                    'mode' => 'add', // Add mode (change to 'overwrite' if needed)
                    'autorename' => true, // To avoid conflicts with the same file name
                ]),
            ])
                ->timeout(300) // Set timeout to 5 minutes
                ->withBody($imageData, 'application/octet-stream') // Attach the binary data
                ->post('https://content.dropboxapi.com/2/files/upload');

            if ($response->successful()) {
                $result = $response->json();
                $path = $result['path_display'];
                $internalResponse = $this->createSharedLink($accessToken, $path);
                return response()->json(['message' => 'File uploaded successfully', 'link' => $internalResponse['url']]);
            } else {
                throw new \Exception('Error uploading file: ' . $response->json()['error']);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
