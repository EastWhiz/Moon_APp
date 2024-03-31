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
        Schema::create('pairbo_collection_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('collection_id');
            $table->unsignedBigInteger('product_id')->index();
            $table->longText('product_tags');
            $table->string('product_title');
            $table->string('product_handle');
            $table->string('product_vendor');
            $table->longText('description');
            $table->string('status');
            $table->string('price');
            $table->longText('image_one')->nullable();
            $table->longText('image_two')->nullable();
            $table->longText('image_three')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pairbo_collection_products');
    }
};
