<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/astronomy-api/appearance',[ApiController::class,'getMoonAppearance'])->name('moonAppearance');
Route::get('/astronomy-api/moon',[ApiController::class,'getMoonPicture'])->name('moonAppearance');
Route::get('/geo-names',[ApiController::class,'getGeoNames'])->name('moonAppearance');
