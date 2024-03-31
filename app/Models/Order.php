<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_name',
        'order_id',
        'email',
        'contact_email',
        'phone_no',
        'order_created_at',
        'customer_name',
        'total',
        'final_total',
        'payment_status',
        'fulfillment_status',
        'customer_id',
        'customer_address',
        'customer_address_two'
    ];

    public function shop()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(OrderLineItem::class, 'local_order_id');
    }

    public function cards()
    {
        return $this->hasMany(CardProduct::class, 'order_id');
    }

    public function messages()
    {
        return $this->hasOne(MessageProduct::class, 'order_id');
    }
}
