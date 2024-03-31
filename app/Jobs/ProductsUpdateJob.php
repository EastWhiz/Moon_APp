<?php

namespace App\Jobs;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use stdClass;
use Osiset\ShopifyApp\Contracts\Commands\Shop as IShopCommand;
use Osiset\ShopifyApp\Contracts\Queries\Shop as IShopQuery;
use Osiset\ShopifyApp\Actions\CancelCurrentPlan;
use App\Jobs\VariantUpdateCreateJob;

class ProductsUpdateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Shop's myshopify domain
     *
     * @var ShopDomain|string
     */
    public $domain;

    /**
     * The webhook data
     *
     * @var object
     */
    public $data;
    public $timeout = 600;
    public $tries = 1;

    /**
     * Create a new job instance.
     *
     * @param string   $shopDomain The shop's myshopify domain.
     * @param stdClass $data       The webhook data (JSON decoded).
     *
     * @return void
     */
    public function __construct(string $domain, $data)
    {
        $this->domain = $domain;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @param IShopCommand      $shopCommand             The commands for shops.
     * @param IShopQuery        $shopQuery               The querier for shops.
     * @param CancelCurrentPlan $cancelCurrentPlanAction The action for cancelling the current plan.
     *
     * @return bool
     */
    public function handle(IShopCommand $shopCommand, IShopQuery $shopQuery, CancelCurrentPlan $cancelCurrentPlanAction): bool
    {
        $this->domain = ShopDomain::fromNative($this->domain);
        $shop = $shopQuery->getByDomain($this->domain);
        $payload = $this->data;
        // Log::info(json_encode($payload));
        // $shopId = $shop->getId();

        Log::info(json_encode("update product job"));
        // Log::info(json_encode($shop));

        $user = User::where('name', $shop->name)->first();
        // sync_products($shop);

        $image_link = "";
        if (isset($payload->image)) {
            $image_link = $payload->image->src;
        } else {
            $image_link = env('APP_URL') . '/images/placeholder_logo.png';
        }

        $current_product = Product::updateOrCreate([
            'product_id' => $payload->id,
        ], [
            'product_tags' => $payload->tags,
            'product_title' => $payload->title,
            'product_handle' => $payload->handle,
            'product_vendor' => $payload->vendor,
            'user_id' => $user->id,
            'description' => "default description",
            'product_image' => $image_link,
            'status' => $payload->status,
            'product_created_at' => $payload->created_at,
            // 'variants_json' => json_encode($payload->variants)
        ]);

        if (isset($payload->variants)) {
            foreach ($payload->variants as $key => $variant) {
                VariantUpdateCreateJob::dispatch($variant, $user, $current_product, "WEBHOOKS", $payload->options);
            }
        }

        // if (isset($payload->images)) {

        //     $count_check = ProductImage::where('product_id', $payload->id)->count();

        //     if ($count_check != count($payload->images)) {

        //        // Log::info($count_check);
        //        // Log::info(count($payload->images));

        //         foreach ($payload->images as $key => $image) {

        //             $inside_image = ProductImage::where('image_id', $image->id)->first();

        //             if (empty($inside_image)) {

        //                // Log::info("NEW IMAGE" .  $image->id);

        //                 ProductImage::create([
        //                     'image_id' => $image->id,
        //                     'user_id' => $user->id,
        //                     'local_product_id' => $product->id,
        //                     'product_id' => $image->product_id,
        //                     'image_src' => $image->src,
        //                 ]);
        //             } else {
        //                // Log::info("OLD IMAGE" .  $image->id);
        //             }
        //         }
        //     }
        // }

        // Log::info(json_encode($product));
        return true;
    }
}
