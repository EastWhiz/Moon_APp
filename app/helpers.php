<?php

use App\Jobs\OrderSeparatedJob;
use App\Jobs\VariantUpdateCreateJob;
use App\Models\Collection;
use App\Models\CollectionProduct;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderLineItem;
use App\Models\Refund;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

if (!function_exists('simpleValidate')) {
    function simpleValidate($validator)
    {
        $error = $validator->errors()->toArray();
        foreach ($error as $x_value) {
            $err[] = $x_value[0];
        }
        return response()->json([
            'success' => false,
            'message' => $err['0'],
        ]);
    }
}

if (!function_exists('sendResponse')) {
    function sendResponse($success, $message = '', $data = null, $data2 = null, $data3 = null, $code = 200)
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'data2' => $data2,
            'data3' => $data3,
        ], $code);
    }
}

if (!function_exists('sendApiLog')) {
    function sendApiLog($success, $message = '', $data = null, $code = 200)
    {
        Log::info($message . json_encode($data));
    }
}

if (!function_exists('responseJson')) {
    function responseJson($success = true, $message = '', $data = null, $data2 = null, $code = 200)
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'data2' => $data2,
        ], $code);
    }
}

if (!function_exists('sync_products')) {
    function sync_products($request)
    {
        DB::beginTransaction();
        try {

            $user = User::where('name', $request->name)->first();
            // Log::info(json_encode($user));

            $perPage = 250;
            $response1 = $user->api()->rest('GET', '/admin/api/2023-04/products/count.json');

            if ($response1['errors'] == false) {

                Log::info(json_encode("PRODUCT COUNT" . $response1['body']['count']));

                $productCount = $response1['body']['count'];
                $iterations = ceil($productCount / $perPage);
                $next = null;

                for ($i = 0; $i < $iterations; $i++) {
                    $response5 = $user->api()->rest('GET', '/admin/api/2023-04/products.json', [
                        'limit' => $perPage,
                        'page_info' => $next
                    ]);

                    if ($response5['errors'] == false) {

                        Log::info(json_encode("PRODUCT" . $response5['errors']));

                        foreach ($response5['body']['products'] as $product) {

                            Log::info(json_encode("PRODUCT" . $product['title']));

                            $image_link = "";
                            if (isset($product->image)) {
                                $image_link = $product->image->src;
                            } else {
                                $image_link = env('APP_URL') . '/images/placeholder_logo.png';
                            }

                            $current_product = Product::updateOrCreate([
                                'product_id' => $product->id,
                            ], [
                                'product_tags' => $product['tags'],
                                'product_title' => $product['title'],
                                'product_handle' => $product['handle'],
                                'product_vendor' => $product['vendor'],
                                'user_id' => $user->id,
                                'description' => "default description",
                                'product_image' => $image_link,
                                'status' => $product['status'],
                                'product_created_at' => $product['created_at'],
                                // 'variants_json' => json_encode($product['variants'])
                            ]);

                            foreach ($product['variants'] as $key => $variant) {
                                VariantUpdateCreateJob::dispatch($variant, $user, $current_product, "HELPERS", $product['options']);
                            }

                            // foreach ($product['images'] as $key => $image) {

                            //     Log::info(json_encode("PRODUCT IMAGES" . $image['product_id']));

                            //     ProductImage::updateOrCreate(
                            //         [
                            //             'image_id' => $image->id,
                            //         ],
                            //         [
                            //             'user_id' => $user->id,
                            //             'local_product_id' => $current_product->id,
                            //             'product_id' => $image['product_id'],
                            //             'image_src' => $image['src'],
                            //         ]
                            //     );
                            // }
                        }

                        if (!$response5['link']) {
                            // Log::info("HERE IS THE BREAK 2 INSIDE");
                            break;
                        }

                        $link = $response5['link'];
                        if ($link) {
                            $next = $link->next;
                        }
                    } else {
                        sendApiLog(false, 'API RESPONSE', $response5);
                        // DB::commit();
                        // return true;
                    }
                }

                $all_collections = array();
                $smart_collections = array();
                $custom_collections = array();

                $response2 = $user->api()->rest('get', '/admin/api/2023-04/smart_collections.json');
                if ($response2['errors'] == false) {

                    Log::info(json_encode("SMART COLLECTION" . $response2['errors']));

                    // $data = $response2['body']['smart_collections'];
                    foreach ($response2['body']['smart_collections'] as $value) {
                        array_push($all_collections, $value);
                        array_push($smart_collections, $value);
                    }
                } else {
                    sendApiLog(false, 'API RESPONSE', $response2);
                    // DB::commit();
                    // return true;
                }

                $response3 = $user->api()->rest('get', '/admin/api/2023-04/custom_collections.json');
                if ($response3['errors'] == false) {

                    Log::info(json_encode("CUSTOM COLLECTION" . $response3['errors']));

                    foreach ($response3['body']['custom_collections'] as $value) {
                        array_push($all_collections, $value);
                        array_push($custom_collections, $value);
                    }
                } else {
                    sendApiLog(false, 'API RESPONSE', $response3);
                    // DB::commit();
                    // return true;
                }

                foreach ($all_collections as $key => $value) {

                    $image_link = "";
                    if (isset($value->image)) {
                        $image_link = $value->image->src;
                    } else {
                        $image_link = env('APP_URL') . '/images/placeholder_logo.png';
                    }

                    Collection::updateOrCreate([
                        'collection_id' => $value['id'],
                    ], [
                        'collection_title' => $value['title'],
                        'collection_handle' => $value['handle'],
                        'collection_image' => $image_link,
                        'user_id' => $user->id,
                        'collection_created_at' => $value['published_at']
                    ]);
                }

                // $nextThree = null;
                // do {
                //     $response11 = $user->api()->rest('GET', '/admin/api/2023-04/collections/289322369220/products.json', [
                //         'limit' => 250,
                //         'page_info' => $nextThree
                //     ]);

                //     Log::info(json_encode($response11['link']));

                //     $finalInside = $response11['link'];
                //     if ($finalInside) {
                //         $nextThree = $finalInside->next;
                //         if (!$finalInside->next) {
                //             Log::info("HERE IS THE BREAK");
                //             break;
                //         }
                //     }
                // } while (true);

                //SMART COLLECTIONS
                foreach ($smart_collections as $key => $value) {

                    $nextThree = null;
                    do {

                        $response11 = $user->api()->rest('GET', '/admin/api/2023-04/collections/' . $value['id'] . '/products.json', [
                            'limit' => 250,
                            'page_info' => $nextThree
                        ]);

                        Log::info(json_encode("SMART COLLECTION NAME" . $value['title']));

                        if ($response11['errors'] == false) {

                            Log::info(json_encode("SMART COLLECTION PRODUCT" . $response11['errors']));

                            foreach ($response11['body']['products'] as $productInside) {

                                Log::info("COLLECTION PRODUCT " . $productInside->id);

                                CollectionProduct::updateOrCreate([
                                    'product_id' => $productInside->id,
                                    'collection_id' => $value['id'],
                                ], [
                                    'user_id' => $user->id,
                                ]);
                            }
                        } else {
                            sendApiLog(false, 'API RESPONSE', $response11);
                            // DB::commit();
                            // return true;
                            break;
                        }

                        // Log::info(json_encode($response11['link']));
                        if (!$response11['link']) {
                            // Log::info("HERE IS THE BREAK 1 INSIDE");
                            break;
                        }

                        $finalInside = $response11['link'];
                        if ($finalInside) {
                            $nextThree = $finalInside->next;
                            if (!$finalInside->next) {
                                // Log::info("HERE IS THE BREAK 1");
                                break;
                            }
                        }
                    } while (true);
                }

                //CUSTOM COLLECTIONS
                foreach ($custom_collections as $key1 => $value) {

                    $nextThree = null;
                    do {

                        $response12 = $user->api()->rest('GET', '/admin/api/2023-04/collections/' . $value['id'] . '/products.json', [
                            'limit' => 250,
                            'page_info' => $nextThree
                        ]);

                        Log::info(json_encode("CUSTOM COLLECTION NAME" . $value['title']));

                        if ($response12['errors'] == false) {

                            Log::info(json_encode("CUSTOM COLLECTION PRODUCT" . $response12['errors']));

                            foreach ($response12['body']['products'] as $productInside) {

                                Log::info("COLLECTION PRODUCT " . $productInside->id);

                                CollectionProduct::updateOrCreate([
                                    'product_id' => $productInside->id,
                                    'collection_id' => $value['id'],
                                ], [
                                    'user_id' => $user->id,
                                ]);
                            }
                        } else {
                            sendApiLog(false, 'API RESPONSE', $response12);
                            break;
                        }

                        // Log::info(json_encode($response12['link']));
                        if (!$response12['link']) {
                            // Log::info("HERE IS THE BREAK 2 INSIDE");
                            break;
                        }

                        $finalInside = $response12['link'];
                        if ($finalInside) {
                            $nextThree = $finalInside->next;
                            if (!$finalInside->next) {
                                // Log::info("HERE IS THE BREAK 2");
                                break;
                            }
                        }
                    } while (true);
                }

                $user->save();

                DB::commit();

                sendApiLog(true, 'PRODUCTS AND COLLECTIONS SYNC SUCCESS', 'PRODUCTS AND COLLECTIONS SYNC SUCCESS');
                //
            } else {

                sendApiLog(false, 'API RESPONSE', $response1);
                DB::commit();
                return true;
            }
            //
        } catch (Exception $e) {
            DB::rollBack();
            // Log::info($e);
            return $e->getMessage();
        }
    }
}

if (!function_exists('sync_orders')) {
    function sync_orders($request)
    {
        DB::beginTransaction();

        $user = User::where('name', $request->name)->first();
        // Log::info(json_encode($user));

        $perPage = 250;
        $response6 = $user->api()->rest('GET', '/admin/api/2023-04/orders/count.json', [
            'status' => 'any'
        ]);

        // Log::info(json_encode($response6));

        if ($response6['errors'] == false) {

            Log::info(json_encode("ORDER COUNT" . $response6['body']['count']));

            $productCount = $response6['body']['count'];

            $iterations = ceil($productCount / $perPage);

            // Log::info($iterations);

            $next = null;

            for ($i = 0; $i < $iterations; $i++) {

                if ($i == 0) {
                    $response7 = $user->api()->rest('GET', '/admin/api/2023-04/orders.json', [
                        'status' => 'any',
                        'limit' => $perPage,
                        'page_info' => $next,
                    ]);
                } else {
                    $response7 = $user->api()->rest('GET', '/admin/api/2023-04/orders.json', [
                        'limit' => $perPage,
                        'page_info' => $next,
                    ]);
                }

                // Log::info(json_encode($response7));

                if ($response7['errors'] == false) {

                    Log::info(json_encode("ORDER" . $response7['errors']));

                    foreach ($response7['body']['orders'] as $order) {
                        OrderSeparatedJob::dispatch($order, $user);
                    }

                    Log::info("THIS IS MY LINK");
                    Log::info(json_encode($response7['link']));

                    if (!$response7['link']) {
                        // Log::info("HERE IS THE BREAK 2 INSIDE");
                        break;
                    }

                    $link = $response7['link'];
                    if ($link) {
                        $next = $link->next;
                    }
                } else {
                    sendApiLog(false, 'API RESPONSE', $response7);
                    // DB::commit();
                    // return true;
                }
            }

            $user->save();

            DB::commit();
            sendApiLog(true, "ORDERS SYNC SUCCESS", 'ORDERS SYNC SUCCESS');
            //
            //
        } else {

            sendApiLog(false, 'API RESPONSE', $response6);
            DB::commit();
            return true;
        }
    }
}

if (!function_exists('removeNodesAndEdges')) {
    function removeNodesAndEdges(&$array)
    {
        if (is_array($array) && !isset($array['edges'])) {
            foreach ($array as $key => $val) {
                $array[$key] = removeNodesAndEdges($val);
            }
        } else if (is_array($array) && isset($array['edges'])) {
            $array = $array['edges'];
            foreach ($array as &$value) {
                $value = $value['node'];
                foreach ($value as &$val) {
                    if (isset($val['edges']) || is_array($val)) {
                        removeNodesAndEdges($val);
                    }
                }
            }
        }
        return $array;
    }
}

if (!function_exists('handleResponse')) {
    function handleResponse($response)
    {
        Log::info($response);

        if ($response->successful()) {
            return $response->json();
        }

        // Handle error responses
        $statusCode = $response->status();
        if ($statusCode === 401) {
            return ['error' => 'Unauthorized'];
        } elseif ($statusCode === 400) {
            return ['error' => 'Bad Request', 'message' => 'Field validation message'];
        } else {
            return ['error' => 'Internal Server Error'];
        }
    }
}