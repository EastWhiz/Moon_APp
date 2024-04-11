<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FireBaseWebhookController extends Controller
{
    public function webhookIntegration(Request $request) {
        return "WEBHOOK DONE";
    }
}
