<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiController extends Controller
{
    private function calculateMoonRotation($phaseAngle, $latitude)
    {
        if ($latitude >= 0) { // Northern Hemisphere
            return fmod($phaseAngle, 360);
        } else { // Southern Hemisphere
            return fmod(($phaseAngle + 180), 360);
        }
    }


    public function getMoonAppearance(Request $request)
    {
        $applicationId = "9e723f28-35b6-4e2b-9cc2-68f2e6139c79";
        $applicationSecret = "63a8693e5f03484b1c124b3cf58f2b4299002fc409d8aec1d2ebffc7953b7b5e4403c254a20647aab44a7e117fe3b61099218a41bc164f937190f91e68eb43f0cb7b894910e8e988e6e5beece882b3f6b29c95494f0eeecbabf98a689d4849eb85778ff4ac53a8f653f5659c83d0c0bb";

        // Combine the credentials with a colon separator
        $authString = base64_encode("{$applicationId}:{$applicationSecret}");

        // Set the API endpoint
        $url = 'https://api.astronomyapi.com/api/v2/bodies/positions/moon';

        $carbonDate = Carbon::createFromFormat('m-d-Y', $request->date)->setTimeFromTimeString(Carbon::now()->toTimeString()); // Set time to 00:00:00 (midnight)

        // API request parameters based on the table you shared
        $latitude = $request->latitude;  // Replace with observer's latitude
        $longitude = $request->longitude;  // Replace with observer's longitude
        $elevation = 1; // replace with actual elevation
        $from_date = $carbonDate->format('Y-m-d'); // replace with actual start date
        $to_date = $carbonDate->format('Y-m-d'); // replace with actual end date
        $time = $carbonDate->format('H:i:s'); // replace with actual time
        // logger(json_encode([$from_date, $to_date, $time]));
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
            // 'from_date' => "2024-12-01",
            // 'to_date' => "2024-12-31",
            'time' => $time,
            'output' => $output,
        ]);

        $data = $response->json();

        $phaseAngle = $data['data']['table']['rows'][0]['cells'][0]['extraInfo']['phase']['angel'];
        $rotationDegree = $this->calculateMoonRotation($phaseAngle, $latitude);
        logger("Rotate the Moon image by " . round($rotationDegree, 2) . "° clockwise.");

        // $finalData = [];
        // foreach ($data['data']['table']['rows'][0]['cells'] as $key => $dat) {
        //     $finalData[] = [
        //         'azimuth' => $dat['position']['horizontal']['azimuth']['degrees'],
        //         'fraction' => $dat['extraInfo']['phase']['fraction'],
        //     ];
        // }

        return $data;
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

    public function getGeoNames(Request $request)
    {
        $searchTerm = $request->input('name_startsWith'); // Get the input from the request

        $url = "http://api.geonames.org/search";
        $params = [
            'name_startsWith' => $searchTerm,
            'maxRows' => 5,
            'username' => 'ouzzall',
            'type' => 'json',
        ];

        try {
            // Make the API request using the Http facade
            $response = Http::get($url, $params);

            if ($response->successful()) {
                $data = $response->json();
                return response([
                    'status' => true,
                    'message' => 'Geo names data retrieved',
                    'data' => $data
                ], 200);
            } else {
                return response()->json(['error' => 'Failed to fetch city data'], $response->status());
            }
        } catch (\Exception $e) {
            // Handle exceptions
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
