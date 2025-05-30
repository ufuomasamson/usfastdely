// Initialize Supabase client
const supabaseUrl = 'https://aiyktqttqqtexxhocoip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpeWt0cXR0cXF0ZXh4aG9jb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjI4MzUsImV4cCI6MjA2MzkzODgzNX0.ikIBv5P6U93kkcEUXQWrhjkH4n3JsLFgeMiK__6QgP8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Page Management
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('d-none');
    });
    // Show the selected page
    document.getElementById(`${pageId}-page`).classList.remove('d-none');
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// Fetch Shipments from Supabase
async function fetchShipments() {
    try {
        const { data: shipments, error } = await supabase
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        updateStats(shipments);
        populateShipmentsTable(shipments);
        populateAllShipmentsTable(shipments);
    } catch (error) {
        console.error('Error fetching shipments:', error);
        alert('Failed to load shipments');
    }
}

// Update dashboard stats
function updateStats(shipments) {
    const totalShipments = shipments.length;
    const inTransit = shipments.filter(shipment => shipment.status === 'in_transit').length;
    const delivered = shipments.filter(shipment => shipment.status === 'delivered').length;
    const issues = shipments.filter(shipment => shipment.status === 'issue').length;

    document.querySelector('.total-orders').textContent = totalShipments;
    document.querySelector('.in-transit').textContent = inTransit;
    document.querySelector('.delivered').textContent = delivered;
    document.querySelector('.issues').textContent = issues;
}

// Populate recent shipments table
function populateShipmentsTable(shipments) {
    const tableBody = document.querySelector('#shipmentsTable tbody');
    tableBody.innerHTML = '';

    shipments.slice(0, 5).forEach(shipment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${shipment.tracking_id}</strong></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="ms-2">
                        <div class="fw-bold">${shipment.receiver_name}</div>
                    </div>
                </div>
            </td>
            <td><span class="badge rounded-pill bg-${getStatusColor(shipment.status)}">${formatStatus(shipment.status)}</span></td>
            <td>${formatDate(shipment.created_at)}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-primary" onclick="viewShipment('${shipment.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="updateShipment('${shipment.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Populate all shipments table
function populateAllShipmentsTable(shipments) {
    const tableBody = document.querySelector('#allShipmentsTable tbody');
    tableBody.innerHTML = '';

    shipments.forEach(shipment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${shipment.tracking_id}</strong></td>
            <td>${shipment.receiver_name}</td>
            <td><span class="badge rounded-pill bg-${getStatusColor(shipment.status)}">${formatStatus(shipment.status)}</span></td>
            <td>${shipment.sender_address}</td>
            <td>${shipment.receiver_address}</td>
            <td>${formatDate(shipment.created_at)}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-primary" onclick="viewShipment('${shipment.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="updateShipment('${shipment.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteShipment('${shipment.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Helper functions
function getStatusColor(status) {
    switch (status) {
        case 'in_transit':
            return 'primary';
        case 'delivered':
            return 'success';
        case 'issue':
            return 'danger';
        case 'pending':
            return 'warning';
        default:
            return 'secondary';
    }
}

function formatStatus(status) {
    return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Create new shipment
async function createShipment(formData) {
    try {
        const { data, error } = await supabase
            .from('shipments')
            .insert([{
                sender_name: formData.get('senderName'),
                sender_address: formData.get('senderAddress'),
                sender_phone: formData.get('senderPhone'),
                receiver_name: formData.get('receiverName'),
                receiver_address: formData.get('receiverAddress'),
                receiver_phone: formData.get('receiverPhone'),
                package_type: formData.get('packageType'),
                weight: formData.get('weight'),
                special_instructions: formData.get('instructions'),
                status: 'pending'
            }]);

        if (error) throw error;

        alert('Shipment created successfully!');
        showPage('dashboard');
        fetchShipments();
    } catch (error) {
        console.error('Error creating shipment:', error);
        alert('Failed to create shipment');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    fetchShipments();

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.currentTarget.id === 'logoutBtn') {
                handleLogout();
            } else {
                const page = e.currentTarget.getAttribute('data-page');
                if (page) showPage(page);
            }
        });
    });

    // Create shipment form
    document.getElementById('createShipmentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        createShipment(formData);
    });

    // Search and filter
    document.getElementById('searchShipments')?.addEventListener('input', handleSearch);
    document.getElementById('statusFilter')?.addEventListener('change', handleFilter);
});

// Logout handler
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Failed to log out');
    }
}

// Search and filter handlers
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterShipments(searchTerm, document.getElementById('statusFilter').value);
}

function handleFilter(e) {
    const statusFilter = e.target.value;
    filterShipments(document.getElementById('searchShipments').value.toLowerCase(), statusFilter);
}

async function filterShipments(searchTerm, status) {
    try {
        let query = supabase
            .from('shipments')
            .select('*');
        
        if (status) {
            query = query.eq('status', status);
        }

        const { data: shipments, error } = await query;

        if (error) throw error;

        const filtered = shipments.filter(shipment =>
            shipment.tracking_id.toLowerCase().includes(searchTerm) ||
            shipment.receiver_name.toLowerCase().includes(searchTerm) ||
            shipment.receiver_address.toLowerCase().includes(searchTerm)
        );

        populateAllShipmentsTable(filtered);
    } catch (error) {
        console.error('Error filtering shipments:', error);
    }
} 