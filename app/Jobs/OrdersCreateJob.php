<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\OrderLineItem;
use App\Models\OrderPrint;
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
                'email' => $payload->email,
                'contact_email' => $payload->contact_email,
                'phone_no' => $payload->phone,
                'order_created_at' => $payload->created_at,
                'customer_name' => isset($payload->customer) ? $payload->customer->first_name . " " . $payload->customer->last_name : NULL,
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

                // Initialize an associative array to store the mapped data
                $data = [];

                // Loop through the properties to map them to the fillable fields
                foreach ($line_item->properties as $property) {
                    switch ($property['name']) {
                        case '_design':
                            $data['design'] = $property['value'];
                            break;
                        case '_cityVisible':
                            $data['cityVisible'] = filter_var($property['value'], FILTER_VALIDATE_BOOLEAN);
                            break;
                        case '_dateVisible':
                            $data['dateVisible'] = filter_var($property['value'], FILTER_VALIDATE_BOOLEAN);
                            break;
                        case '_starsEffect':
                            $data['starsEffect'] = filter_var($property['value'], FILTER_VALIDATE_BOOLEAN);
                            break;
                        case '_title':
                            $data['title'] = $property['value'];
                            break;
                        case '_titleFont':
                            $data['titleFont'] = $property['value'];
                            break;
                        case '_paragraphText':
                            $data['paragraphText'] = $property['value'];
                            break;
                        case '_paragraphTextFont':
                            $data['paragraphTextFont'] = $property['value'];
                            break;
                        case '_selectedDate':
                            $data['selectedDate'] = $property['value'];
                            break;
                        case '_city':
                            $data['city'] = $property['value'];
                            break;
                        case '_titleFontSize':
                            $data['titleFontSize'] = $property['value'];
                            break;
                        case '_paragraphFontSize':
                            $data['paragraphFontSize'] = $property['value'];
                            break;
                    }
                }

                // Add additional fields if necessary
                $data['user_id'] = $user->id; // or another way to get the user_id
                $data['order_id'] = $order->id; // Replace with the appropriate order ID

                // Save the mapped data to the database
                $orderPrint = OrderPrint::create($data);

                DropboxJob::dispatch($user, $orderPrint);
            }
        }

        // Log::info(json_encode($order));
        return true;
    }
}
