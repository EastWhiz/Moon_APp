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
        Schema::create('order_prints', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('order_id');
            $table->string('design')->nullable();
            $table->boolean('cityVisible')->default(false);
            $table->boolean('dateVisible')->default(false);
            $table->boolean('starsEffect')->default(false);
            $table->string('title')->nullable();
            $table->string('titleFont')->nullable();
            $table->string('paragraphText')->nullable();
            $table->string('paragraphTextFont')->nullable();
            $table->string('selectedDate')->nullable();
            $table->longText('city')->nullable();
            $table->decimal('titleFontSize', 4, 2)->nullable();
            $table->decimal('paragraphFontSize', 4, 2)->nullable();
            $table->enum('status', ['unprocessed', 'processed'])->default('unprocessed');
            $table->string('link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_prints');
    }
};
