<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiController extends Controller
{
    public function getMoonAppearance(Request $request)
    {
        $applicationId = "9e723f28-35b6-4e2b-9cc2-68f2e6139c79";
        $applicationSecret = "63a8693e5f03484b1c124b3cf58f2b4299002fc409d8aec1d2ebffc7953b7b5e4403c254a20647aab44a7e117fe3b61099218a41bc164f937190f91e68eb43f0cb7b894910e8e988e6e5beece882b3f6b29c95494f0eeecbabf98a689d4849eb85778ff4ac53a8f653f5659c83d0c0bb";

        // Combine the credentials with a colon separator
        $authString = base64_encode("{$applicationId}:{$applicationSecret}");

        // Set the API endpoint
        $url = 'https://api.astronomyapi.com/api/v2/bodies/positions/moon';

        // API request parameters based on the table you shared
        $latitude = 31.5203696;  // Replace with observer's latitude
        $longitude = 74.3436;  // Replace with observer's longitude
        $elevation = 1; // replace with actual elevation
        $date = "2024-12-14";
        $from_date = "2024-12-08"; // replace with actual start date
        $to_date = "2024-12-08"; // replace with actual end date
        $time = '12:37:25'; // replace with actual time
        $output = 'table'; // or 'rows, table'

        // API headers (replace with actual header values)
        $headers = [
            'Authorization' => 'Basic ' . $authString,  // Set the Authorization header with base64 encoded credentials
        ];

        // Make the request with Guzzle
        $response = Http::withHeaders($headers)->get($url, [
            'latitude' => $latitude,
            'longitude' => $longitude,
            'elevation' => $elevation,
            'from_date' => $from_date,
            'to_date' => $to_date,
            'time' => $time,
            'output' => $output,
        ]);
        return $data = $response->json();

        $rows = collect($data['data']['table']['rows'][0]['cells']);

        $data = [];
        foreach ($rows as $key => $row) {
            $data[] = $row['position'];
        }
        return $data;

        return view('welcome', compact('data'));
    }

    public function getMoonPicture(Request $request)
    {
        $applicationId = "9e723f28-35b6-4e2b-9cc2-68f2e6139c79";
        $applicationSecret = "63a8693e5f03484b1c124b3cf58f2b4299002fc409d8aec1d2ebffc7953b7b5e4403c254a20647aab44a7e117fe3b61099218a41bc164f937190f91e68eb43f0cb7b894910e8e988e6e5beece882b3f6b29c95494f0eeecbabf98a689d4849eb85778ff4ac53a8f653f5659c83d0c0bb";

        // Combine the credentials with a colon separator
        $authString = base64_encode("{$applicationId}:{$applicationSecret}");

        // Define your endpoint
        $url = 'https://api.astronomyapi.com/api/v2/studio/moon-phase';

        // Set up the request headers with the Authorization header
        $headers = [
            'Authorization' => 'Basic ' . $authString,  // Set the Authorization header with base64 encoded credentials
        ];

        // Define the request body data
        $data = [
            'format' => 'png',  // Set your desired format (png or svg)
            "style" => [
                "moonStyle" => "sketch",
                "backgroundStyle"    => "stars",
                "backgroundColor" => "red",
                "headingColor" => "white",
                "textColor" => "red"
            ],
            'observer' => [
                'latitude' => 31.5203696,  // Replace with observer's latitude
                'longitude' => 74.3436,  // Replace with observer's longitude
                'date' => '2024-11-22',  // Replace with observer's date (YYYY-MM-DD)
            ],
            'view' => [
                'type' => 'portrait-simple',  // Example of view type, adjust based on API documentation
                'orientation' => 'north-up',  // Optional: 'north-up' or 'south-up'
            ],
        ];

        // Make the POST request
        $response = Http::withHeaders($headers)->post($url, $data);
        return $response->json();
    }
}