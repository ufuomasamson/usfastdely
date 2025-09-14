<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shipment;

class ShipmentsController extends Controller
{
    public function index()
    {
        // List all shipments (admin)
        $shipments = Shipment::all();
        return response()->json($shipments);
    }

    public function store(Request $request)
    {
        // Create a new shipment (admin)
        $validated = $request->validate([
            'itemName' => 'required|string',
            'senderName' => 'required|string',
            'senderAddress' => 'required|string',
            'receiverName' => 'required|string',
            'receiverAddress' => 'required|string',
            'origin' => 'required|string',
            'destination' => 'required|string',
            'currentCountry' => 'required|string',
            'currentState' => 'required|string',
            'status' => 'sometimes|string',
            'condition' => 'sometimes|string',
        ]);

        // Generate tracking number
        $validated['trackingNumber'] = $this->generateTrackingNumber();
        $validated['status'] = $validated['status'] ?? 'Processing';
        $validated['condition'] = $validated['condition'] ?? 'Good';

        $shipment = Shipment::create($validated);
        return response()->json($shipment, 201);
    }

    public function show($trackingNumber)
    {
        // Public: Track a shipment by tracking number
        $shipment = Shipment::where('trackingNumber', $trackingNumber)->first();
        if (!$shipment) {
            return response()->json(['message' => 'Shipment not found'], 404);
        }
        return response()->json($shipment);
    }

    public function update(Request $request, $id)
    {
        // Update a shipment (admin)
        $shipment = Shipment::find($id);
        if (!$shipment) {
            return response()->json(['message' => 'Shipment not found'], 404);
        }
        $shipment->update($request->only([
            'status', 'currentCountry', 'currentState', 'condition'
        ]));
        return response()->json($shipment);
    }

    public function destroy($id)
    {
        // Delete a shipment (admin)
        $shipment = Shipment::find($id);
        if (!$shipment) {
            return response()->json(['message' => 'Shipment not found'], 404);
        }
        $shipment->delete();
        return response()->json(['message' => 'Shipment deleted']);
    }

    private function generateTrackingNumber()
    {
        $prefix = "TRK";
        $random = mt_rand(100000000, 999999999); // 9-digit
        return $prefix . $random;
    }
}
