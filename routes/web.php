<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\CustomizerController;
use App\Http\Controllers\FireBaseWebhookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopsController;
use App\Jobs\SyncProductsJob;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\Browsershot\Browsershot;

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
        // $check = Product::where('user_id', $user->id)->first();
        // if (empty($check)) {
        //     SyncProductsJob::dispatch($user);
        //     SyncOrdersJob::dispatch($user);
        // }

        return Inertia::render('Client/Orders', compact('response'));
    })->name('home');

    Route::get('orders', [OrdersController::class, 'getOrders'])->name('orders.get.client');
});

Route::group(['middleware' => ['auth', 'verified']], function () {

    //NON EMBEDDED LINKS
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->group(function () {
        Route::inertia('dashboard', 'Admin/Dashboard')->name('dashboard');
        Route::inertia('orders', 'Admin/Orders')->name('orders');
        Route::get('get-orders', [OrdersController::class, 'getOrders'])->name('orders.get');
        Route::get('dashboard-data', [DashboardController::class, 'getDashboard']);
    });
});

Route::inertia('admin/render', 'Admin/Render')->name('render');

// Route::get("/function", function () {
//     // Browsershot::url('https://www.google.com')->save('ss.png');

//     ini_set('max_execution_time', 600);       // 600 seconds = 10 minutes
//     ini_set('upload_max_filesize', '1024M'); // 1024 MB
//     ini_set('post_max_size', '1024M');

//     Browsershot::url('http://127.0.0.1:8000/admin/render?design=midnight_blue&cityVisible=true&dateVisible=true&starsEffect=true&title=Lahore&titleFont=outfit&paragraphText=City%20of%20Lights&paragraphTextFont=italiana&selectedDate=30-01-2025&city={%22name%22:%22Lahore,%20Punjab,%20Pakistan%22,%22value%22:%22Lahore%22,%22lat%22:%2231.558%22,%22lng%22:%2274.35071%22}&titleFontSize=1&paragraphFontSize=0.75&moon=full&rotateValue=45&newMoon=false')
//         ->waitUntilNetworkIdle()
//         ->timeout(180000)
//         ->waitForSelector('#allGoodToGo')
//         ->select('#cardIdParent')
//         ->setScreenshotType('jpeg', 100)
//         ->deviceScaleFactor(4) // Mimics 300 DPI
//         ->windowSize(9000, 5700)
//         ->save('ss.jpeg');
// });

require __DIR__ . '/auth.php';
