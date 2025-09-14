<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\ShipmentsController;

Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::get('/shipments/{trackingNumber}', [ShipmentsController::class, 'show']); // Public tracking

// Admin routes (add auth middleware later)
Route::post('/shipments', [ShipmentsController::class, 'store']);
Route::get('/shipments', [ShipmentsController::class, 'index']);
Route::patch('/shipments/{id}', [ShipmentsController::class, 'update']);
Route::delete('/shipments/{id}', [ShipmentsController::class, 'destroy']); 