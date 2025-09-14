const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Sample tracking data (in a real app, this would come from a database)
const trackingData = {
    'TRK848223508': {
        currentStatus: 'In Transit',
        estimatedDelivery: '2024-01-15',
        currentLocation: 'New York Sorting Center',
        lastUpdated: '2024-01-10 14:30',
        nextDestination: 'Chicago Distribution Center',
        sender: {
            name: 'John Doe',
            address: '123 Sender St, Origin City',
            contact: '+1 234-567-8900'
        },
        receiver: {
            name: 'Jane Smith',
            address: '456 Receiver Ave, Destination City',
            contact: '+1 234-567-8901'
        },
        history: [
            {
                status: 'In Transit',
                location: 'New York Sorting Center',
                timestamp: '2024-01-10 14:30'
            },
            {
                status: 'Picked Up',
                location: 'Origin City Warehouse',
                timestamp: '2024-01-10 09:15'
            }
        ]
    }
};

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/client-2')));

// API Routes
app.get('/api/tracking/:trackingNumber', (req, res) => {
    const { trackingNumber } = req.params;
    console.log(`Tracking request received for: ${trackingNumber}`);

    const shipment = trackingData[trackingNumber];
    
    if (shipment) {
        res.json(shipment);
    } else {
        res.status(404).json({
            status: 'error',
            message: 'Tracking information not found'
        });
    }
});

// Alternative endpoint for the same functionality
app.get('/api/shipments/:trackingNumber', (req, res) => {
    const { trackingNumber } = req.params;
    console.log(`Tracking request received for: ${trackingNumber}`);

    const shipment = trackingData[trackingNumber];
    
    if (shipment) {
        res.json(shipment);
    } else {
        res.status(404).json({
            status: 'error',
            message: 'Tracking information not found'
        });
    }
});

// Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/client-2/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 