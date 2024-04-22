<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CardProduct extends Model
{
    use HasFactory;

    public function details() 
    {
        return $this->hasMany(CardProductDetail::class,'card_product_id','id');
    }
}
