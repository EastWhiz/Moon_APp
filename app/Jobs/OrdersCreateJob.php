<?php

namespace App\Jobs;

use App\Models\CardProduct;
use App\Models\MessageProduct;
use App\Models\Order;
use App\Models\OrderLineItem;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use Osiset\ShopifyApp\Contracts\Queries\Shop as IShopQuery;
use stdClass;

class OrdersCreateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Shop's myshopify domain
     *
     * @var ShopDomain|string
     */
    public $shopDomain;

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
    public function __construct($shopDomain, $data)
    {
        $this->shopDomain = $shopDomain;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(IShopQuery $shopQuery): bool
    {
        $this->shopDomain = ShopDomain::fromNative($this->shopDomain);
        $shop = $shopQuery->getByDomain($this->shopDomain);
        $payload = $this->data;
        // $shopId = $shop->getId();

        Log::info(json_encode("order create job"));
        // Log::info(json_encode($payload));

        $user = User::where('name', $shop->name)->first();
        // sync_orders($shop);

        $order = Order::updateOrCreate(
            [
                'order_id' => $payload->id,
            ],
            [
                'order_name' => $payload->name,
                'customer_id' => isset($payload->customer) ? $payload->customer->id : NULL,
                'user_id' => $user->id,
                // 'email' => $payload->email,
                // 'contact_email' => $payload->contact_email,
                // 'phone_no' => $payload->phone,
                'order_created_at' => $payload->created_at,
                // 'customer_name' => isset($payload->customer) ? $payload->customer->first_name . " " . $payload->customer->last_name : NULL,
                'customer_address' => isset($payload->billing_address) ? $payload->billing_address->address1 . " " . $payload->billing_address->city  : NULL,
                'customer_address_two' => isset($payload->shipping_address) ? $payload->shipping_address->address1 . " " . $payload->shipping_address->city   : NULL,
                'total' => $payload->subtotal_price,
                'final_total' => $payload->total_price,
                'payment_status' => $payload->financial_status,
                'fulfillment_status' => $payload->fulfillment_status
            ]
        );

        if (isset($payload->line_items)) {
            foreach ($payload->line_items as $key9 => $line_item) {

                OrderLineItem::updateOrCreate(
                    [
                        'line_item_id' => $line_item->id,
                    ],
                    [
                        'user_id' => $user->id,
                        'local_order_id' => $order->id,
                        'order_id' => $payload->id,
                        'product_id' => $line_item->product_id,
                        'name' => $line_item->name,
                        'price' => $line_item->price,
                        'quantity' => $line_item->quantity,
                        'weight' => $line_item->grams,
                    ]
                );
            }
        }

        foreach ($payload->line_items as $key => $item) {
            $created = CardProduct::where('product_id', $item->product_id)->first();
            if ($created) {
                $created->order_id = $order->id;
                $created->save();

                $response = $user->api()->rest('post', '/admin/api/2023-04/products/' . $item->product_id . '/images.json', [
                    "image" => [
                        "position" => 4,
                        "src" => env('APP_URL') . "/" . $created->canvas_image,
                    ]
                ]);

                $response = $user->api()->rest('post', '/admin/api/2023-04/products/' . $item->product_id . '/images.json', [
                    "image" => [
                        "position" => 5,
                        "src" => env('APP_URL') . "/" . $created->qr_code_image,
                    ]
                ]);

                $response = $user->api()->rest('put', '/admin/api/2023-04/products/' . $item->product_id . '.json', [
                    "product" => [
                        "status" => "draft",
                        "published_at" => NULL,
                    ],
                ]);

                Log::info("Creating Extra Charges");

                $charge = [
                    'name' => $user->name . " " . $payload->id . " " . $item->name,
                    'price' => 3.0,
                ];

                $response = $user->api()->rest('post', '/admin/api/2023-04/recurring_application_charges.json', ["recurring_application_charge" => $charge]);
                if ($response['status'] == 201) {
                    $charges = $response['body']['container']['recurring_application_charge'];
                    Log::info($charges);
                }

                $metadata = json_decode($created->metadata_json);

                $response = $user->api()->rest('put', '/admin/api/2023-04/orders/' . $payload->id . '.json', [
                    "order" => [
                        "note_attributes" => [[
                            "name" => 'Font Style',
                            "value" => $metadata->fontStyle,
                        ], [
                            "name" => 'Font Color',
                            "value" => $metadata->fontColor,
                        ], [
                            "name" => 'Message',
                            "value" => $metadata->message,
                        ], [
                            "name" => 'Pairbo Product ID',
                            "value" => $metadata->productId,
                        ], [
                            "name" => 'Merchant ID',
                            "value" => $metadata->merchantId,
                        ]]
                    ],
                ]);

                // Log::info(json_encode($response));
            }
        }

        if (count($payload->note_attributes)) {
            foreach ($payload->note_attributes as $attribute) {
                if ($attribute->name == "pairboMessage" && $attribute->value == "Yes") {
                    $message = new MessageProduct;
                    $message->user_id = $user->id;
                    $message->order_id = $order->id;
                    $message->message = $payload->note;
                    $message->save();
                }
            }
        }

        // Log::info(json_encode($order));
        return true;
    }
}
