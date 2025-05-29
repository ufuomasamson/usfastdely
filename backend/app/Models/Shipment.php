<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    public $timestamps = true;
    
    // Prevent Laravel from converting camelCase to snake_case
    public static $snakeAttributes = false;

    protected $fillable = [
        'trackingNumber',
        'senderName',
        'receiverName',
        'origin',
        'destination',
        'currentCountry',
        'currentState',
        'status',
        'condition',
    ];
}
