<?php

namespace App\Http\Controllers;

use App\Models\PairboCollection;
use App\Models\PairboCollectionProduct;
use App\Models\PairboProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PairboProductsController extends Controller
{
    public function getPairbo()
    {
        $continue = true;
        $page = 1;
        $limit = 250;

        do {
            $response = Http::get("https://pairbo.com/products.json?limit=$limit&page=$page");
            if ($response->successful()) {
                $data = $response->json();
                // Log::info(json_encode(count($data['products'])));

                foreach ($data['products'] as $key => $product) {

                    // Log::info(json_encode($product['images']));

                    PairboProduct::updateOrCreate([
                        'product_id' => $product['id'],
                    ], [
                        'product_tags' => implode(",", $product['tags']),
                        'product_title' => $product['title'],
                        'product_handle' => $product['handle'],
                        'product_vendor' => $product['vendor'],
                        'description' => "default description",
                        'status' => "Active",
                        'price' => $product['variants'][0]['price'],
                        'image_one' => isset($product['images'][0]) ? $product['images'][0]['src'] : null,
                        'image_two' => isset($product['images'][1]) ? $product['images'][1]['src'] : null,
                        'image_three' => isset($product['images'][2]) ? $product['images'][2]['src'] : null,
                    ]);
                }

                $page++;
                if (count($data['products']) < 250)
                    $continue = false;
            }
        } while ($continue);

        $continue = true;
        $page = 1;
        $limit = 250;

        do {
            $response = Http::get("https://pairbo.com/collections.json?limit=$limit&page=$page");
            if ($response->successful()) {
                $data = $response->json();

                foreach ($data['collections'] as $key => $collection) {

                    PairboCollection::updateOrCreate([
                        'collection_id' => $collection['id'],
                        'collection_title' => $collection['title'],
                        'collection_handle' => $collection['handle'],
                    ]);

                    $inside_continue = true;
                    $inside_page = 1;
                    $inside_limit = 250;

                    do {
                        $inside_response = Http::get("https://pairbo.com/collections/" . $collection['handle'] . "/products.json?limit=$inside_limit&page=$inside_page");
                        if ($inside_response->successful()) {
                            $inside_data = $inside_response->json();

                            foreach ($inside_data['products'] as $key => $product) {

                                PairboCollectionProduct::updateOrCreate([
                                    'product_id' => $product['id'],
                                    'collection_id' => $collection['id'],
                                ], [
                                    'product_tags' => implode(",", $product['tags']),
                                    'product_title' => $product['title'],
                                    'product_handle' => $product['handle'],
                                    'product_vendor' => $product['vendor'],
                                    'description' => "default description",
                                    'status' => "Active",
                                    'price' => $product['variants'][0]['price'],
                                    'image_one' => isset($product['images'][0]) ? $product['images'][0]['src'] : null,
                                    'image_two' => isset($product['images'][1]) ? $product['images'][1]['src'] : null,
                                    'image_three' => isset($product['images'][2]) ? $product['images'][2]['src'] : null,
                                ]);
                            }

                            $inside_page++;
                            if (count($inside_data['products']) < 250)
                                $inside_continue = false;
                        }
                    } while ($inside_continue);
                }

                $page++;
                if (count($data['collections']) < 250)
                    $continue = false;
            }
        } while ($continue);

        return sendResponse(true, "Pairbo products fetched Successfully");
    }
}
