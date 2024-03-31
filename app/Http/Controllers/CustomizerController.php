<?php

namespace App\Http\Controllers;

use App\Jobs\DeletePairboJob;
use App\Models\CardProduct;
use App\Models\PairboCollection;
use App\Models\PairboProduct;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CustomizerController extends Controller
{
    public function getStoreFront(Request $request)
    {
        $shop = User::where('name', $request->shop)->first();
        if (!$shop->status)
            return sendResponse(false, "Shop is not enabled right now.");

        $products = PairboProduct::get();

        $collections = PairboCollection::with('products')->get();

        return sendResponse(true, "Pairbo retrieved Successfully", $products, $collections);
    }

    public function loadFile($filename)
    {
        $file = public_path("assets/fonts/" . $filename);
        if (file_exists($file)) {
            $headers = [
                'Content-Type' => mime_content_type($file),
            ];
            return response()->file($file, $headers);
        }
        return response()->json(['error' => 'File not found'], 404);
    }

    public function createProduct(Request $request)
    {
        Log::info("YOUR TIME STARTS NOW");

        $user = User::where('name', $request->shop)->first();

        if (empty($user))
            return sendResponse(false, "Shop does not exist");

        $front_image_url = $request->front_image_url;
        $image_two = $request->pairbo_image_two;
        $image_three = $request->pairbo_image_three;

        // $image = $request->file('canvas');
        // $base64Image = base64_encode(file_get_contents($image->path()));

        // return $request->model;

        $response = $user->api()->rest('post', '/admin/api/2023-04/products.json', [
            "product" => [
                "title" => "Premium Greeting Card",
                "body_html" => "<strong>Pairbo</strong>",
                "vendor" => "Pairbo",
                "product_type" => "Pairbo",
                "tags" => "Pairbo, Greeting Card",
                "variant" => [
                    "price" => "5.00",
                    "inventory_management" => null,
                ],
                "images" => [
                    ["src" => $front_image_url],
                    ["src" => $image_two],
                    ["src" => $image_three],
                ]
            ],
        ]);

        DeletePairboJob::dispatch($user->id, $response['body']['product']['id'])->delay(now()->addMinutes(5));

        // $response2 = $user->api()->rest('post', '/admin/api/2023-04/products/' . $response['body']['product']['id'] . '/images.json', [
        //     "image" => [
        //         "position" => 2,
        //         "src" => "",
        //         "metafields" => [
        //             [
        //                 "key" => "new",
        //                 "value" => "newvalue",
        //                 "type" => "single_line_text_field",
        //                 "namespace" => "global"
        //             ]
        //         ],
        //         "attachment" => $base64Image,
        //         "filename" => "generate.png"
        //     ]
        // ]);

        $filename2 = "";
        if (isset($request->canvas)) {
            $file = $request->file('canvas');
            $filename2 = time() . '-' . $file->getClientOriginalName();
            request()->canvas->storeAs('public/uploaded_images', $filename2);
        }

        $filename3 = "";
        if (isset($request->qr_code)) {
            $file = $request->file('qr_code');
            $filename3 = time() . '-' . $file->getClientOriginalName();
            request()->qr_code->storeAs('public/uploaded_images', $filename3);
        }

        if ($response['errors'] == false) {
            $product = new CardProduct;
            $product->user_id = $user->id;
            $product->product_id = $response['body']['product']['id'];
            $product->variant_id = $response['body']['product']['variants'][0]['id'];
            $product->pairbo_product_id = $request->pairbo_product_id;
            $product->tags = $response['body']['product']['tags'];
            $product->price = "5.00";
            $product->canvas_image = "storage/uploaded_images/" . $filename2;
            $product->qr_code_image = "storage/uploaded_images/" . $filename3;
            $product->font_style = $request->font_style;
            $product->font_color = $request->font_color;
            $product->message = $request->message;
            $product->metadata_json = $request->metadata_json;
            $product->save();

            $object['product_id'] = $response['body']['product']['id'];
            $object['variant_id'] = $response['body']['product']['variants'][0]['id'];

            return sendResponse(true, "Product Created Successfully", $object);
        } else {
            sendApiLog(false, 'API RESPONSE', $response);
        }
    }
}
