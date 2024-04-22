<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CardProductDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_product_id',
        'unique_cart_id',
        'order_id',
        'canvas_image',
        'qr_code_image',
        'font_style',
        'font_color',
        'message',
        'metadata_json'
    ];
}
