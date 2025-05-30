// Initialize Supabase client
const supabaseUrl = 'https://aiyktqttqqtexxhocoip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpeWt0cXR0cXF0ZXh4aG9jb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjI4MzUsImV4cCI6MjA2MzkzODgzNX0.ikIBv5P6U93kkcEUXQWrhjkH4n3JsLFgeMiK__6QgP8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Page Management
function showPage(pageId) {
    console.log('Showing page:', pageId);
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('d-none');
    });
    // Show the selected page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.remove('d-none');
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
    } else {
        console.error(`Page ${pageId} not found`);
    }
}

// Fetch Shipments from Supabase
async function fetchShipments() {
    try {
        const { data: shipments, error } = await supabase
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('Fetched shipments:', shipments);
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
    const totalShipments = shipments ? shipments.length : 0;
    const inTransit = shipments ? shipments.filter(shipment => shipment.status === 'in_transit').length : 0;
    const delivered = shipments ? shipments.filter(shipment => shipment.status === 'delivered').length : 0;
    const issues = shipments ? shipments.filter(shipment => shipment.status === 'issue').length : 0;

    document.querySelector('.total-orders').textContent = totalShipments;
    document.querySelector('.in-transit').textContent = inTransit;
    document.querySelector('.delivered').textContent = delivered;
    document.querySelector('.issues').textContent = issues;
}

// Populate recent shipments table
function populateShipmentsTable(shipments) {
    const tableBody = document.querySelector('#shipmentsTable tbody');
    if (!tableBody) {
        console.error('Shipments table body not found');
        return;
    }
    
    tableBody.innerHTML = '';

    if (!shipments || shipments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="text-center">No shipments found</td>';
        tableBody.appendChild(row);
        return;
    }

    shipments.slice(0, 5).forEach(shipment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${shipment.tracking_id || shipment.id}</strong></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="ms-2">
                        <div class="fw-bold">${shipment.receiver_name || 'N/A'}</div>
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
    if (!tableBody) {
        console.error('All shipments table body not found');
        return;
    }

    tableBody.innerHTML = '';

    if (!shipments || shipments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No shipments found</td>';
        tableBody.appendChild(row);
        return;
    }

    shipments.forEach(shipment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${shipment.tracking_id || shipment.id}</strong></td>
            <td>${shipment.receiver_name || 'N/A'}</td>
            <td><span class="badge rounded-pill bg-${getStatusColor(shipment.status)}">${formatStatus(shipment.status)}</span></td>
            <td>${shipment.sender_address || 'N/A'}</td>
            <td>${shipment.receiver_address || 'N/A'}</td>
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
    if (!status) return 'N/A';
    return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Create new shipment
async function createShipment(formData) {
    try {
        // Generate a random tracking ID
        const trackingId = 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const shipmentData = {
            tracking_id: trackingId,
            sender_name: formData.get('senderName'),
            sender_address: formData.get('senderAddress'),
            sender_phone: formData.get('senderPhone'),
            receiver_name: formData.get('receiverName'),
            receiver_address: formData.get('receiverAddress'),
            receiver_phone: formData.get('receiverPhone'),
            package_type: formData.get('packageType'),
            weight: parseFloat(formData.get('weight')),
            special_instructions: formData.get('instructions'),
            status: 'pending',
            created_at: new Date().toISOString()
        };

        console.log('Creating shipment:', shipmentData);

        const { data, error } = await supabase
            .from('shipments')
            .insert([shipmentData]);

        if (error) throw error;

        alert('Shipment created successfully!');
        showPage('dashboard');
        fetchShipments();
    } catch (error) {
        console.error('Error creating shipment:', error);
        alert('Failed to create shipment: ' + error.message);
    }
}

// Action handlers
async function viewShipment(id) {
    try {
        const { data: shipment, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        alert(`Viewing shipment details:\n${JSON.stringify(shipment, null, 2)}`);
    } catch (error) {
        console.error('Error viewing shipment:', error);
        alert('Failed to view shipment details');
    }
}

async function updateShipment(id) {
    try {
        const { data: shipment, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        const newStatus = prompt('Enter new status (pending, in_transit, delivered, issue):', shipment.status);
        if (!newStatus) return;

        const { error: updateError } = await supabase
            .from('shipments')
            .update({ status: newStatus })
            .eq('id', id);

        if (updateError) throw updateError;

        alert('Shipment status updated successfully!');
        fetchShipments();
    } catch (error) {
        console.error('Error updating shipment:', error);
        alert('Failed to update shipment');
    }
}

async function deleteShipment(id) {
    if (!confirm('Are you sure you want to delete this shipment?')) return;

    try {
        const { error } = await supabase
            .from('shipments')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert('Shipment deleted successfully!');
        fetchShipments();
    } catch (error) {
        console.error('Error deleting shipment:', error);
        alert('Failed to delete shipment');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing dashboard...');
    
    // Initial load
    fetchShipments();

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            if (e.currentTarget.id === 'logoutBtn') {
                handleLogout();
            } else {
                const page = e.currentTarget.getAttribute('data-page');
                if (page) {
                    console.log('Navigation clicked:', page);
                    showPage(page);
                }
            }
        });
    });

    // Create shipment form
    const createShipmentForm = document.getElementById('createShipmentForm');
    if (createShipmentForm) {
        createShipmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            createShipment(formData);
        });
    } else {
        console.error('Create shipment form not found');
    }

    // Search and filter
    const searchInput = document.getElementById('searchShipments');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', handleFilter);
    }
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
    filterShipments(searchTerm, document.getElementById('statusFilter')?.value || '');
}

function handleFilter(e) {
    const statusFilter = e.target.value;
    filterShipments(document.getElementById('searchShipments')?.value.toLowerCase() || '', statusFilter);
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
            (shipment.tracking_id || '').toLowerCase().includes(searchTerm) ||
            (shipment.receiver_name || '').toLowerCase().includes(searchTerm) ||
            (shipment.receiver_address || '').toLowerCase().includes(searchTerm)
        );

        populateAllShipmentsTable(filtered);
    } catch (error) {
        console.error('Error filtering shipments:', error);
    }
} 