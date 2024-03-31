<?php

namespace App\Jobs;

use App\Models\ProductVariant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class VariantUpdateCreateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    public $variant = "";
    public $user = "";
    public $current_product = "";
    public $job_source = "";
    public $virtual_options = "";

    public function __construct($variant, $user, $current_product, $job_source, $virtual_options)
    {
        $this->variant = $variant;
        $this->user = $user;
        $this->current_product = $current_product;
        $this->job_source = $job_source;
        $this->virtual_options = $virtual_options;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $variant = $this->variant;
        $user = $this->user;
        $current_product = $this->current_product;
        $job_source = $this->job_source;
        $virtual_options = $this->virtual_options;

        if($job_source == "HELPERS") {
            Log::info(json_encode("PRODUCT VARIANT INSIDE JOB HELPERS.PHP" . $variant['title']));

            ProductVariant::updateOrCreate([
                'variant_id' => $variant['id'],
            ], [
                'user_id' => $user->id,
                'local_product_id' => $current_product->id,
                'product_id' => $variant['product_id'],
                'title' => $variant['title'],
                'option1' => $variant['option1'],
                'option2' => $variant['option2'],
                'option3' => $variant['option3'],
                'price' => $variant['price'],
                'quantity' => $variant['inventory_quantity'],
                'sku' => $variant['sku']
            ]);

            //SAGE PRODUCT CREATE

            $color_position = "";
            $size_position = "";
            foreach ($virtual_options as $key => $option) {
                if ($option['name'] == "Color" || $option['name'] == "color") {
                    $color_position = $option['position'];
                }
                if ($option['name'] == "Size" || $option['name'] == "size") {
                    $size_position = $option['position'];
                }
            }

            $payload = [
                'vendor_name' => $current_product->product_vendor,
                'title' => $current_product->product_title,
                'item_id' => $variant['sku'],
                'price' => $variant['price'],
                'shipping_weight' => 0.00,
                'brand' => '',
                'subbrand' => '',
                'category' => '',
                'subcategory' => '',
                'size1' => $size_position == 1 ? $variant['option1'] : $variant['option2'],
                'style' => '',
                'color' => $color_position == 1 ? $variant['option1'] : $variant['option2'],
            ];
            // Log::info(json_encode($payload));

        } else if($job_source == "WEBHOOKS") {
            Log::info(json_encode("PRODUCT VARIANT INSIDE JOB WEBHOOKS" . $variant->title));

            ProductVariant::create([
                'variant_id' => $variant->id,
                'user_id' => $user->id,
                'local_product_id' => $current_product->id,
                'product_id' => $variant->product_id,
                'title' => $variant->title,
                'option1' => $variant->option1,
                'option2' => $variant->option2,
                'option3' => $variant->option3,
                'price' => $variant->price,
                'quantity' => isset($variant->inventory_quantity) ? $variant->inventory_quantity : 0,
                'sku' => $variant->sku
            ]);

              //SAGE PRODUCT CREATE

              $color_position = "";
              $size_position = "";
              foreach ($virtual_options as $key => $option) {
                  if ($option->name == "Color" || $option->name == "color") {
                      $color_position = $option->position;
                  }
                  if ($option->name == "Size" || $option->name == "size") {
                      $size_position = $option->position;
                  }
              }

              $payload = [
                'vendor_name' => $current_product->product_vendor,
                'title' => $current_product->product_title,
                'item_id' => $variant->sku,
                'price' => $variant->price,
                'shipping_weight' => 0.00,
                'brand' => '',
                'subbrand' => '',
                'category' => '',
                'subcategory' => '',
                'size1' =>  $size_position == 1 ? $variant->option1 : $variant->option2,
                'style' => '',
                'color' => $color_position == 1 ? $variant->option1 : $variant->option2,
            ];
            // Log::info(json_encode($payload));
        }
    }
}
