<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\CustomizerController;
use App\Http\Controllers\DropboxController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/astronomy-api/appearance', [ApiController::class, 'getMoonAppearance'])->name('moonAppearance');
Route::get('/astronomy-api/moon', [ApiController::class, 'getMoonPicture'])->name('moonAppearance');
Route::get('/geo-names', [ApiController::class, 'getGeoNames'])->name('moonAppearance');
Route::get('/fonts/{fontName}', function ($fontName) {
    $path = public_path('fonts/' . $fontName);

    if (file_exists($path)) {
        return response()->download($path, $fontName);
    }

    return response()->json(['error' => 'Font not found'], 404);
});
Route::get('/images/{imageName}', function ($fontName) {
    $path = public_path('images/' . $fontName);

    if (file_exists($path)) {
        return response()->download($path, $fontName);
    }

    return response()->json(['error' => 'image not found'], 404);
});
Route::post('/upload-file', [DropboxController::class, 'uploadFileToDropbox'])->name('fileUpload');
