<?php

namespace App\Http\Controllers;

use App\Jobs\DeletePairboJob;
use App\Models\CardProduct;
use App\Models\PairboCollection;
use App\Models\PairboProduct;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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

        $existing_product = CardProduct::where('pairbo_product_id',$request->pairbo_product_id)->first();
        $product_exist = $user->api()->rest('get', '/admin/api/2023-04/products/' . @$existing_product->product_id . '.json');
        Log::info(json_encode($existing_product));
        Log::info(json_encode($product_exist));
        if($existing_product && $product_exist['errors'] == false) {

            $existing_product->details()->create([
                'unique_cart_id' => $request->unique_cart_id,
                'canvas_image' => "storage/uploaded_images/" . $filename2,
                'qr_code_image' => "storage/uploaded_images/" . $filename3,
                'font_style' => $request->font_style,
                'font_color' => $request->font_color,
                'message' => $request->message ? $request->message : "NO_MESSAGE",
                'metadata_json' => $request->metadata_json,
            ]);

            $object['product_id'] = $existing_product->product_id;
            $object['variant_id'] = $existing_product->variant_id;
            if($product_exist['body']['product']['status'] == "active") { 
                return sendResponse(true, "Product Already Created Successfully and active", $object);
            } else {
                return $product_active = $user->api()->rest('put', '/admin/api/2023-04/products/' . $existing_product->product_id . '.json', [
                    "product" => [
                        "status" => "active",
                        "published_at" => Carbon::now(),
                    ],
                ]);
                return sendResponse(true, "Product Already Created Successfully but draft. now active", $object);
            }
        } else {

            if($existing_product) {
                Log::info("DELETING EXISTING DATA FROM DATABASE");
                $existing_product->details()->delete();
                $existing_product->delete();
            }

            $front_image_url = $request->front_image_url;
            $image_two = $request->pairbo_image_two;
            $image_three = $request->pairbo_image_three;

            // Log::info($front_image_url);
            // Log::info($image_two);
            // Log::info($image_three);

            $response = $user->api()->rest('post', '/admin/api/2023-04/products.json', [
                "product" => [
                    "title" => "Premium Greeting Card",
                    "handle" => "$request->pairbo_product_id",
                    "body_html" => "<strong>Pairbo</strong>",
                    "vendor" => "Pairbo",
                    "product_type" => "Pairbo",
                    "tags" => "Pairbo, Greeting Card",
                    "variant" => [
                        "price" => "5.00",
                        "inventory_management" => null,
                        "sku" => "$request->pairbo_product_id",
                    ],
                    "images" => [
                        ["src" => $front_image_url],
                        ["src" => $image_two],
                        ["src" => $image_three],
                    ]
                ],
            ]);
            // Log::info(json_encode($response));

            $response4 = $user->api()->rest('post', '/admin/api/2024-04/products/' . $response['body']['product']['id'] . '/metafields.json',[
                'metafield' => [
                    'namespace'=> "seo",
                    'key' => "hidden",
                    'type' => "number_integer",
                    'value' => 1
                ] 
            ]);
            // Log::info(json_encode($response4));
        
            if ($response['errors'] == false) {
                $product = new CardProduct;
                $product->user_id = $user->id;
                $product->product_id = $response['body']['product']['id'];
                $product->variant_id = $response['body']['product']['variants'][0]['id'];
                $product->pairbo_product_id = $request->pairbo_product_id;
                $product->tags = $response['body']['product']['tags'];
                $product->price = "5.00";
                $product->save();

                $product->details()->create([
                    'unique_cart_id' => $request->unique_cart_id,
                    'canvas_image' => "storage/uploaded_images/" . $filename2,
                    'qr_code_image' => "storage/uploaded_images/" . $filename3,
                    'font_style' => $request->font_style,
                    'font_color' => $request->font_color,
                    'message' => $request->message ? $request->message : "NO_MESSAGE",
                    'metadata_json' => $request->metadata_json,
                ]);

                $object['product_id'] = $response['body']['product']['id'];
                $object['variant_id'] = $response['body']['product']['variants'][0]['id'];

                return sendResponse(true, "Product Created Successfully", $object);
            } else {
                sendApiLog(false, 'API RESPONSE', $response);
            }
        }
    }

    public function deleteCron(Request $request) {
        
        $card_products = CardProduct::get();

        foreach ($card_products as $key => $card) {
            DeletePairboJob::dispatch($card->user_id, $card->product_id);
        }
    }
}
