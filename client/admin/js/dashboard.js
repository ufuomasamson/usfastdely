// Sample data - Replace with actual data from your backend
const sampleOrders = [
    {
        id: 'ORD001',
        customer: 'John Doe',
        status: 'In Transit',
        date: '2024-03-15'
    },
    {
        id: 'ORD002',
        customer: 'Jane Smith',
        status: 'Delivered',
        date: '2024-03-14'
    },
    {
        id: 'ORD003',
        customer: 'Mike Johnson',
        status: 'Pending',
        date: '2024-03-13'
    }
];

// Update stats
function updateStats() {
    const totalOrders = sampleOrders.length;
    const inTransit = sampleOrders.filter(order => order.status === 'In Transit').length;
    const delivered = sampleOrders.filter(order => order.status === 'Delivered').length;
    const issues = sampleOrders.filter(order => order.status === 'Issue').length;

    document.querySelector('.total-orders').textContent = totalOrders;
    document.querySelector('.in-transit').textContent = inTransit;
    document.querySelector('.delivered').textContent = delivered;
    document.querySelector('.issues').textContent = issues;
}

// Populate orders table
function populateOrdersTable() {
    const tableBody = document.querySelector('#ordersTable tbody');
    tableBody.innerHTML = '';

    sampleOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
            <td>${formatDate(order.date)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-secondary" onclick="editOrder('${order.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Helper functions
function getStatusColor(status) {
    switch (status) {
        case 'In Transit':
            return 'primary';
        case 'Delivered':
            return 'success';
        case 'Issue':
            return 'danger';
        default:
            return 'secondary';
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Action handlers
function viewOrder(orderId) {
    alert(`Viewing order ${orderId}`);
    // Implement view order functionality
}

function editOrder(orderId) {
    alert(`Editing order ${orderId}`);
    // Implement edit order functionality
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    populateOrdersTable();

    // Add active class to current nav item
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}); 