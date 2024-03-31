<?php

namespace App\Jobs;

use App\Models\CardProduct;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class DeletePairboJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */

    public $user_id = "";
    public $product_id = "";

    public function __construct($user_id, $product_id)
    {
        $this->user_id = $user_id;
        $this->product_id = $product_id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Log::info($this->user_id);
        // Log::info($this->product_id);

        $user = User::find($this->user_id);

        $use_less_product = CardProduct::where('user_id', $user->id)->where('product_id', $this->product_id)->whereNull('order_id')->first();
        // Log::info(json_encode($use_less_product));

        if ($use_less_product) {
            $response = $user->api()->rest('put', '/admin/api/2023-04/products/' . $this->product_id . '.json', [
                "product" => [
                    "status" => "draft",
                    "published_at" => NULL,
                ],
            ]);

            if ($response['errors'] == false) {
                // Log::info(json_encode($response));
                $use_less_product->delete();
            } else {
                sendApiLog(false, 'API RESPONSE', $response);
            }
        }
    }
}
