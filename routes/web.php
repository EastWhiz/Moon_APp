<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PairboProductsController;
use App\Http\Controllers\CustomizerController;
use App\Http\Controllers\FireBaseWebhookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopsController;
// use App\Jobs\SyncOrdersJob;
use App\Jobs\SyncProductsJob;
use App\Models\PairboProduct;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['middleware' => ['verify.embedded', 'verify.shopify', 'billable']], function () {

    //EMBEDDED LINKS
    Route::get('/', function () {

        $user = Auth::user();
        $user = User::find($user->id);

        if(!$user->all_settings) {

            $query = <<<GRAPHQL
                {
                    collections(first: 10, query: "title:*all*") {
                        edges {
                            node {
                            id
                            title
                            legacyResourceId
                            }
                        }
                    }
                }
            GRAPHQL;
            $collections = $user->api()->graph($query);
    
            $all_collection_id = false;
            if(count($collections['body']['data']['collections']['edges']) > 0) {
                $all_collection_id = $collections['body']['data']['collections']['edges'][0]['node']['id'];
            } else {
                $collection = $user->api()->rest('post', '/admin/api/2024-01/custom_collections.json', [
                    'custom_collection' => [
                        'title' => 'All'
                    ]
                ]);
                $all_collection_id = $collection['body']['custom_collection']['admin_graphql_api_id'];
                $products = $user->api()->rest('GET', '/admin/api/2024-01/products.json', [
                    'fields' => 'admin_graphql_api_id'
                ]);
                $productIds = collect($products['body']['products'])->pluck('admin_graphql_api_id');         
                $mutation = <<<GRAPHQL
                mutation collectionAddProducts(\$id: ID!,\$productIds: [ID!]!) {
                    collectionAddProducts(id: \$id, productIds: \$productIds) {
                        collection {
                            title
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
                GRAPHQL;
                $variables = [
                    'id' => $all_collection_id,
                    'productIds' => $productIds,
                ];          
                $response = $user->api()->graph($mutation, $variables);
                return $response;
            }
            Log::info($all_collection_id);
            
            $query = <<<GRAPHQL
            {
                metafieldDefinitions(first: 10, ownerType: PRODUCT, namespace: "seo", key: "hidden") {
                    edges {
                        node {
                            id
                            namespace
                            key
                            name
                            description
                        }
                    }
                }
            }
            GRAPHQL;
            $definitions = $user->api()->graph($query);
            $definition_id = false;
            if(count($definitions['body']['data']['metafieldDefinitions']['edges']) > 0) {
                $definition_id = $definitions['body']['data']['metafieldDefinitions']['edges'][0]['node']['id'];
            } else {
                $payload = '{
                    "definition": {
                      "namespace": "seo",
                      "key": "hidden",
                      "name": "Hide Products from Store",
                      "type": "number_integer",
                      "ownerType": "PRODUCT",
                      "description": "Metafield to hide products from the store."
                    }
                }';
                $mutation = <<<GRAPHQL
                mutation MetafieldDefinitionCreate(\$definition: MetafieldDefinitionInput!) {
                    metafieldDefinitionCreate(definition: \$definition) {
                        createdDefinition {
                            id
                            namespace
                            key
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
                GRAPHQL;
                $variables = [
                    'definition' => json_decode($payload, true)['definition']
                ];
                $definition = $user->api()->graph($mutation, $variables);
                $definition_id = $definition['body']['data']['metafieldDefinitionCreate']['createdDefinition']['id'];
            }
            Log::info($definition_id);
    
            $user->all_settings = true;
            $user->save();
        }

        if (!isset($user->store_name)) {
            $response = $user->api()->rest('GET', '/admin/api/2023-04/shop.json');

            if ($response['errors'] == false) {
                $shopName = $response['body']['shop']['name'];
                $shop = User::find($user->id);
                $shop->store_name = $shopName;
                $shop->save();
            } else {
                sendApiLog(false, 'API RESPONSE', $response);
            }
        }

        $response = $user->api()->rest('get', '/admin/api/2023-04/webhooks.json', []);
        $check = Product::where('user_id', $user->id)->first();
        if (empty($check)) {
            SyncProductsJob::dispatch($user);
            // SyncOrdersJob::dispatch($user);
        }

        $check = PairboProduct::first();
        if (empty($check)) {
            $controller = app()->make(PairboProductsController::class);
            $controller->getPairbo();
        }

        return Inertia::render('Client/Orders', compact('response'));
    })->name('home');

    Route::get('orders', [OrdersController::class, 'getOrders'])->name('orders.get.client');
    Route::inertia('instructions', 'Client/Instructions')->name('instructions');
});

Route::group(['middleware' => ['auth', 'verified']], function () {

    //NON EMBEDDED LINKS
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::prefix('admin')->group(function () {
        Route::inertia('dashboard', 'Admin/Dashboard')->name('dashboard');
        Route::inertia('shops', 'Admin/Shops')->name('shops');
        Route::inertia('orders', 'Admin/Orders')->name('orders');

        Route::get('get-shops', [ShopsController::class, 'getShops'])->name('shops.get');
        Route::post('enable-shop', [ShopsController::class, 'enableShop']);

        Route::get('get-orders', [OrdersController::class, 'getOrders'])->name('orders.get');

        Route::get('dashboard-data', [DashboardController::class, 'getDashboard']);
    });
});

Route::get('/get-pairbo', [PairboProductsController::class, 'getPairbo']);

Route::get('/delete-cron', [CustomizerController::class, 'deleteCron']);

Route::get('/webhook-integration', [FireBaseWebhookController::class, 'webhookIntegration']);

// Route::get('/test', function () {
    // $user = User::find(3);

    // $query = <<<GRAPHQL
    //     {
    //         productVariant(id: "gid://shopify/ProductVariant/46539352473876") {
    //             inventoryItem {
    //               id
    //               inventoryLevels(first: 5) {
    //                 edges {
    //                   node {
    //                     location {
    //                       id
    //                       name
    //                     }
    //                     available
    //                   }
    //                 }
    //               }
    //             }
    //         }
    //     }
    //     GRAPHQL;
    // $response = $user->api()->graph($query);
    // return $response;
// });

// Route::get('/test', function () {
//     $user = User::find(3);
// });



require __DIR__ . '/auth.php';
