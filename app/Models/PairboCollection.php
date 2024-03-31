<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PairboCollection extends Model
{
    use HasFactory;

    protected $fillable = [
        'collection_id', 'collection_title', 'collection_handle'
    ];

    public function products()
    {
        return $this->hasMany(PairboCollectionProduct::class, 'collection_id', 'collection_id');
    }
}
