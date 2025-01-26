<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderPrint extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'design',
        'cityVisible',
        'dateVisible',
        'starsEffect',
        'title',
        'titleFont',
        'paragraphText',
        'paragraphTextFont',
        'selectedDate',
        'city',
        'titleFontSize',
        'paragraphFontSize',
        'status',
        'link'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
