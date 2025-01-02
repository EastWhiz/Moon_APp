<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


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
