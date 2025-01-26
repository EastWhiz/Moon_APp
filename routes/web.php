<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PrintsController;
use App\Http\Controllers\CustomizerController;
use App\Http\Controllers\FireBaseWebhookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopsController;
use App\Jobs\DropboxJob;
use App\Jobs\SyncProductsJob;
use App\Models\OrderPrint;
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

        return Inertia::render('Client/Prints', compact('response'));
    })->name('home');

    Route::get('prints', [PrintsController::class, 'getPrints'])->name('prints.get.client');
    Route::post('retry-print', [PrintsController::class, 'retryPrint'])->name('retry.print');
});

Route::group(['middleware' => ['auth', 'verified']], function () {

    //NON EMBEDDED LINKS
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->group(function () {
        Route::inertia('dashboard', 'Admin/Dashboard')->name('dashboard');
        Route::get('dashboard-data', [DashboardController::class, 'getDashboard']);
        // Route::inertia('prints', 'Client/Prints')->name('prints');
        // Route::get('get-prints', [PrintsController::class, 'getPrints'])->name('prints.get.client');
        // Route::post('retry-print', [PrintsController::class, 'retryPrint'])->name('retry.print');
    });
});

Route::inertia('admin/render', 'Admin/Render')->name('render');

Route::get("/function", function () {

    $user = User::find(2);
    $order_print = OrderPrint::find(2);

    DropboxJob::dispatch($user, $order_print);
});

require __DIR__ . '/auth.php';
