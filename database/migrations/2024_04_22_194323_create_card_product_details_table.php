<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('card_product_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('card_product_id');
            $table->string('unique_cart_id');
            $table->string('order_id')->nullable();
            $table->string('canvas_image');
            $table->string('qr_code_image');
            $table->string('font_style');
            $table->string('font_color');
            $table->string('message')->nullable();
            $table->longText('metadata_json');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('card_product_details');
    }
};
