<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PairboProductsController;
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

Route::get('/test', function () {
    $user = User::find(2);

    $query = <<<GRAPHQL
        {
            productVariant(id: "gid://shopify/ProductVariant/46539352473876") {
                inventoryItem {
                  id
                  inventoryLevels(first: 5) {
                    edges {
                      node {
                        location {
                          id
                          name
                        }
                        available
                      }
                    }
                  }
                }
            }
        }
        GRAPHQL;
    $response = $user->api()->graph($query);
    return $response;
});


require __DIR__ . '/auth.php';
