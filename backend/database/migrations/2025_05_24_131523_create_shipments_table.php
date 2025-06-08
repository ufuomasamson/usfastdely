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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('trackingNumber')->unique();
            $table->string('itemName');
            $table->string('senderName');
            $table->string('senderAddress');
            $table->string('receiverName');
            $table->string('receiverAddress');
            $table->string('origin');
            $table->string('destination');
            $table->string('currentCountry');
            $table->string('currentState');
            $table->string('status')->default('Processing'); // Processing, In Transit, Delivered, Delayed
            $table->string('condition')->default('Good');    // Good, Damaged, Lost
            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
