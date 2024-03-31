<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PairboProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'product_handle', 'product_variant_id', 'product_title', 'description', 'product_tags', 'product_vendor', 'status', 'price', 'image_one', 'image_two', 'image_three'
    ];
}
