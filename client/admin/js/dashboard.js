// Initialize Supabase client
const supabaseUrl = 'https://nambnsqatauhreahpnyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbWJuc3FhdGF1aHJlYWhwbnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MzAyNTksImV4cCI6MjA2NjUwNjI1OX0.HsHte14nkbZgcUQSJlbJOyrCHZ8l2huN98JtZ3qjyuc';

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'Content-Type': 'application/json'
        }
    }
});

// Check authentication status on load
async function checkAuth() {
    try {
        const adminUser = localStorage.getItem('adminUser');
        if (!adminUser) {
            window.location.href = '/admin/login.html';
            return false;
        }

        const user = JSON.parse(adminUser);
        if (!user.isLoggedIn) {
            window.location.href = '/admin/login.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/admin/login.html';
        return false;
    }
}

// Page Management
function showPage(pageId) {
    console.log('Showing page:', pageId);
    
    // Remove active class from all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        // Refresh data when showing shipments page
        if (pageId === 'shipments') {
            fetchShipments();
        }
    } else {
        console.error(`Page ${pageId} not found`);
    }
}

// Fetch Shipments from Supabase
async function fetchShipments() {
    try {
        // Check authentication first
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
            throw new Error('Not authenticated');
        }

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
        if (error.message.includes('Not authenticated')) {
            window.location.href = '/login.html';
        } else {
            showAlert('danger', 'Failed to load shipments: ' + error.message);
        }
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
        row.innerHTML = '<td colspan="9" class="text-center">No shipments found</td>';
        tableBody.appendChild(row);
        return;
    }

    shipments.forEach(shipment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${shipment.tracking_number}</strong></td>
            <td>${shipment.sender_name || 'N/A'}</td>
            <td>${shipment.receiver_name || 'N/A'}</td>
            <td>${shipment.origin || 'N/A'}</td>
            <td>${shipment.destination || 'N/A'}</td>
            <td>${shipment.current_country || 'N/A'}, ${shipment.current_state || 'N/A'}</td>
            <td><span class="badge rounded-pill bg-${getStatusColor(shipment.status)}">${shipment.status}</span></td>
            <td><span class="badge rounded-pill bg-${getConditionColor(shipment.condition)}">${shipment.condition}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-primary me-2" onclick="editShipment(${shipment.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteShipment(${shipment.id})">
                        <i class="fas fa-trash"></i> Delete
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
        case 'Processing':
            return 'info';
        case 'In Transit':
            return 'primary';
        case 'Delivered':
            return 'success';
        case 'Delayed':
            return 'warning';
        case 'On Hold':
            return 'secondary';
        default:
            return 'light';
    }
}

function getConditionColor(condition) {
    switch (condition) {
        case 'Good':
            return 'success';
        case 'Damaged':
            return 'warning';
        case 'Lost':
            return 'danger';
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
        // Check authentication first
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
            throw new Error('Not authenticated');
        }

        const shipmentData = {
            item_name: formData.get('item_name'),
            sender_name: formData.get('sender_name'),
            sender_address: formData.get('sender_address'),
            receiver_name: formData.get('receiver_name'),
            receiver_address: formData.get('receiver_address'),
            origin: formData.get('origin'),
            destination: formData.get('destination'),
            current_country: formData.get('current_country'),
            current_state: formData.get('current_state'),
            status: formData.get('status'),
            condition: formData.get('condition')
        };

        console.log('Creating shipment:', shipmentData);

        // First try to insert the shipment
        const { data: newShipment, error: insertError } = await supabase
            .from('shipments')
            .insert([shipmentData]);

        if (insertError) {
            console.error('Insert error:', insertError);
            throw new Error(insertError.message || 'Failed to create shipment');
        }

        // Then fetch the created shipment to get the tracking number
        const { data: createdShipment, error: fetchError } = await supabase
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (fetchError) {
            console.error('Fetch error:', fetchError);
            throw new Error(fetchError.message || 'Failed to fetch created shipment');
        }

        showAlert('success', `Shipment created successfully! Tracking number: ${createdShipment.tracking_number}`);
        document.getElementById('createShipmentForm').reset();
        showPage('shipments');
        fetchShipments();
    } catch (error) {
        console.error('Error creating shipment:', error);
        showAlert('danger', error.message || 'Failed to create shipment');
        
        if (error.message.includes('session expired') || error.message.includes('Not authenticated')) {
            setTimeout(() => window.location.href = '/admin/login.html', 2000);
        }
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
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing dashboard...');
    
    // Check authentication first
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        return;
    }

    // Initial load
    fetchShipments();

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
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
        createShipmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            await createShipment(formData);
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
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login.html';
    } catch (error) {
        console.error('Error logging out:', error);
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login.html';
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

// Edit shipment function
async function editShipment(id) {
    try {
        const { data: shipment, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'editShipmentModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Shipment</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editShipmentForm">
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" name="status" required>
                                    ${["Processing", "In Transit", "Delivered", "Delayed", "On Hold"]
                                        .map(s => `<option value="${s}" ${shipment.status === s ? 'selected' : ''}>${s}</option>`)
                                        .join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Condition</label>
                                <select class="form-select" name="condition" required>
                                    ${["Good", "Damaged", "Lost"]
                                        .map(c => `<option value="${c}" ${shipment.condition === c ? 'selected' : ''}>${c}</option>`)
                                        .join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Current Country</label>
                                <input type="text" class="form-control" name="current_country" value="${shipment.current_country || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Current State</label>
                                <input type="text" class="form-control" name="current_state" value="${shipment.current_state || ''}" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="updateShipment(${id})">Update</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Clean up modal when hidden
        modal.addEventListener('hidden.bs.modal', function () {
            document.body.removeChild(modal);
        });

    } catch (error) {
        console.error('Error fetching shipment:', error);
        showAlert('danger', 'Failed to load shipment details');
    }
}

// Update shipment function
async function updateShipment(id) {
    const form = document.getElementById('editShipmentForm');
    const formData = new FormData(form);
    const updateData = {
        status: formData.get('status'),
        condition: formData.get('condition'),
        current_country: formData.get('current_country'),
        current_state: formData.get('current_state')
    };

    try {
        const { error } = await supabase
            .from('shipments')
            .update(updateData)
            .eq('id', id);

        if (error) throw error;

        const modal = bootstrap.Modal.getInstance(document.getElementById('editShipmentModal'));
        modal.hide();
        showAlert('success', 'Shipment updated successfully');
        fetchShipments();
    } catch (error) {
        console.error('Error updating shipment:', error);
        showAlert('danger', 'Failed to update shipment: ' + error.message);
    }
}

// Delete shipment function
async function deleteShipment(id) {
    if (!confirm('Are you sure you want to delete this shipment?')) return;

    try {
        const { error } = await supabase
            .from('shipments')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showAlert('success', 'Shipment deleted successfully');
        fetchShipments();
    } catch (error) {
        console.error('Error deleting shipment:', error);
        showAlert('danger', 'Failed to delete shipment: ' + error.message);
    }
}

// Helper function to show alerts
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Find the main content container
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        // Insert at the top of main content
        mainContent.insertBefore(alertDiv, mainContent.firstChild);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            if (alertDiv && alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    } else {
        console.error('Main content container not found');
    }
}
