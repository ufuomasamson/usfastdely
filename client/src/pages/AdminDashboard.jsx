import React, { useEffect, useState } from "react";
import {
  CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormLabel, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CAlert, CSpinner, CSidebar, CSidebarBrand, CSidebarNav, CNavItem, CNavTitle, CNavLink, CHeader, CHeaderBrand, CHeaderNav, CHeaderToggler,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormSelect
} from '@coreui/react';
import { cilSpeedometer, cilList, cilPlus, cilAccountLogout, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { shipmentService } from "../config/supabase";
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

// Custom styles to match the template
const styles = {
  sidebar: {
    backgroundColor: '#1F1F2E',
    color: '#FFFFFF',
    minHeight: '100vh',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  },
  sidebarBrand: {
    backgroundColor: '#FF4800',
    color: '#FFFFFF',
    padding: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  sidebarNav: {
    padding: '1rem 0'
  },
  navLink: {
    color: '#FFFFFF',
    padding: '0.75rem 1.5rem',
    margin: '0.25rem 0.75rem',
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 72, 0, 0.1)',
      color: '#FF4800'
    }
  },
  activeNavLink: {
    backgroundColor: '#FF4800',
    color: '#FFFFFF',
    padding: '0.75rem 1.5rem',
    margin: '0.25rem 0.75rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 5px rgba(255, 72, 0, 0.2)'
  },
  mainContent: {
    backgroundColor: '#F2F2F4',
    minHeight: '100vh',
    padding: '2rem'
  },
  card: {
    border: 'none',
    borderRadius: '0.5rem',
    boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
  },
  cardHeader: {
    backgroundColor: '#FF4800',
    color: '#FFFFFF',
    borderBottom: 'none',
    borderRadius: '0.5rem 0.5rem 0 0',
    padding: '1rem 1.5rem'
  },
  button: {
    backgroundColor: '#FF4800',
    borderColor: '#FF4800',
    '&:hover': {
      backgroundColor: '#e64100',
      borderColor: '#e64100'
    }
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.5rem'
  },
  statIcon: {
    fontSize: '24px',
    width: '24px',
    height: '24px'
  },
  statCard: {
    padding: '1.5rem'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#1F1F2E'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#757575',
    marginBottom: '0'
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Sidebar state
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  // State for shipments
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedTracking, setGeneratedTracking] = useState("");

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);

  // State for form
  const [form, setForm] = useState({
    sender_name: "",
    receiver_name: "",
    origin: "",
    destination: "",
    current_country: "",
    current_state: "",
    status: "Processing",
    condition: "Good"
  });

  // Status options
  const statusOptions = ["Processing", "In Transit", "Delivered", "Delayed", "On Hold"];
  const conditionOptions = ["Good", "Damaged", "Lost"];

  // Fetch shipments
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const data = await shipmentService.getAllShipments();
      setShipments(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch shipments: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'shipments') {
      fetchShipments();
    }
  }, [activeSection]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setGeneratedTracking("");
    setLoading(true);
    try {
      const data = await shipmentService.createShipment(form);
      setSuccess("Shipment created successfully!");
      setGeneratedTracking(data.tracking_number);
      setForm({
        sender_name: "",
        receiver_name: "",
        origin: "",
        destination: "",
        current_country: "",
        current_state: "",
        status: "Processing",
        condition: "Good"
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit shipment
  const handleEdit = (shipment) => {
    setEditingShipment(shipment);
    setEditModalVisible(true);
  };

  // Handle update shipment
  const handleUpdate = async () => {
    try {
      await shipmentService.updateShipment(editingShipment.id, {
        status: editingShipment.status,
        condition: editingShipment.condition,
        current_country: editingShipment.current_country,
        current_state: editingShipment.current_state
      });
      setEditModalVisible(false);
      fetchShipments();
      setSuccess("Shipment updated successfully!");
    } catch (err) {
      setError("Failed to update shipment: " + err.message);
    }
  };

  // Handle delete shipment
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this shipment?")) {
      try {
        await shipmentService.deleteShipment(id);
        fetchShipments();
        setSuccess("Shipment deleted successfully!");
      } catch (err) {
        setError("Failed to delete shipment: " + err.message);
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (err) {
      setError('Failed to logout: ' + err.message);
    }
  };

  // Update the navigation items to include logout handler
  const navItems = [
    { label: 'Dashboard', icon: cilSpeedometer, section: 'dashboard' },
    { label: 'Shipments', icon: cilList, section: 'shipments' },
    { label: 'Create Shipment', icon: cilPlus, section: 'create' },
    { 
      label: 'Logout', 
      icon: cilAccountLogout, 
      section: 'logout',
      onClick: handleLogout 
    }
  ];

  // Render different sections based on activeSection
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <CCard className="shadow rounded-4 border-0 bg-light">
            <CCardHeader className="bg-primary text-white rounded-top-4">Admin Dashboard</CCardHeader>
            <CCardBody>
              <h5 className="fw-bold">Welcome, Admin!</h5>
              <p className="text-muted">Use the sidebar to manage shipments and more.</p>
              <div className="mt-4">
                <CRow>
                  <CCol md={4}>
                    <CCard className="mb-4 shadow-sm">
                      <CCardBody className="text-center">
                        <h4>{shipments.length}</h4>
                        <p className="text-muted mb-0">Total Shipments</p>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol md={4}>
                    <CCard className="mb-4 shadow-sm">
                      <CCardBody className="text-center">
                        <h4>{shipments.filter(s => s.status === "In Transit").length}</h4>
                        <p className="text-muted mb-0">In Transit</p>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol md={4}>
                    <CCard className="mb-4 shadow-sm">
                      <CCardBody className="text-center">
                        <h4>{shipments.filter(s => s.status === "Delivered").length}</h4>
                        <p className="text-muted mb-0">Delivered</p>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </div>
            </CCardBody>
          </CCard>
        );

      case 'shipments':
        return (
          <CCard style={styles.card}>
            <CCardHeader style={styles.cardHeader}>
              <h4 className="mb-0">Manage Shipments</h4>
            </CCardHeader>
            <CCardBody className="bg-white p-4">
              {error && <CAlert color="danger">{error}</CAlert>}
              {success && <CAlert color="success">{success}</CAlert>}
              {loading ? (
                <div className="text-center py-5">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CTable style={styles.table} hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Tracking Number</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Sender</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Receiver</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Origin</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Destination</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Current Location</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {shipments.map((shipment) => (
                      <CTableRow key={shipment.id}>
                        <CTableDataCell>{shipment.tracking_number}</CTableDataCell>
                        <CTableDataCell>{shipment.sender_name}</CTableDataCell>
                        <CTableDataCell>{shipment.receiver_name}</CTableDataCell>
                        <CTableDataCell>{shipment.origin}</CTableDataCell>
                        <CTableDataCell>{shipment.destination}</CTableDataCell>
                        <CTableDataCell>
                          <span className={`badge bg-${getStatusColor(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          {shipment.current_country}, {shipment.current_state}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton 
                            color="primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(shipment)}
                          >
                            <CIcon icon={cilPencil} /> Edit
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(shipment.id)}
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        );

      case 'create':
        return (
          <CCard style={styles.card}>
            <CCardHeader style={styles.cardHeader}>
              <h4 className="mb-0">Create New Shipment</h4>
            </CCardHeader>
            <CCardBody className="bg-white p-4">
              {error && <CAlert color="danger">{error}</CAlert>}
              {success && <CAlert color="success">{success}</CAlert>}
              <CForm onSubmit={handleSubmit}>
                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel>Sender Name</CFormLabel>
                      <CFormInput
                        type="text"
                        name="sender_name"
                        value={form.sender_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel>Receiver Name</CFormLabel>
                      <CFormInput
                        type="text"
                        name="receiver_name"
                        value={form.receiver_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel>Origin</CFormLabel>
                      <CFormInput
                        type="text"
                        name="origin"
                        value={form.origin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel>Destination</CFormLabel>
                      <CFormInput
                        type="text"
                        name="destination"
                        value={form.destination}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel>Current Country</CFormLabel>
                      <CFormInput
                        type="text"
                        name="current_country"
                        value={form.current_country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel>Current State</CFormLabel>
                      <CFormInput
                        type="text"
                        name="current_state"
                        value={form.current_state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel>Status</CFormLabel>
                      <CFormSelect
                        name="status"
                        value={form.status}
                        onChange={handleInputChange}
                        required
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div className="mb-3">
                      <CFormLabel>Condition</CFormLabel>
                      <CFormSelect
                        name="condition"
                        value={form.condition}
                        onChange={handleInputChange}
                        required
                      >
                        {conditionOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CCol>
                </CRow>

                <div className="text-end mt-4">
                  <CButton type="submit" style={styles.button} disabled={loading}>
                    {loading ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Creating...
                      </>
                    ) : (
                      'Create Shipment'
                    )}
                  </CButton>
                </div>

                {generatedTracking && (
                  <CAlert color="success" className="mt-4">
                    <h5>Shipment Created Successfully!</h5>
                    <p className="mb-0">
                      Tracking Number: <strong>{generatedTracking}</strong>
                    </p>
                  </CAlert>
                )}
              </CForm>
            </CCardBody>
          </CCard>
        );

      default:
        return null;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
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
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <CSidebar 
        visible={sidebarVisible} 
        onVisibleChange={setSidebarVisible}
        style={styles.sidebar}
        className="border-end-0"
      >
        <CSidebarBrand style={styles.sidebarBrand} className="d-flex align-items-center justify-content-center">
          <h3 className="m-0">FASTER</h3>
        </CSidebarBrand>
        <CSidebarNav style={styles.sidebarNav}>
          {navItems.map((item) => (
            <CNavItem key={item.section} className="px-3">
              <CNavLink 
                onClick={() => item.onClick ? item.onClick() : setActiveSection(item.section)}
                active={activeSection === item.section}
                style={activeSection === item.section ? styles.activeNavLink : styles.navLink}
                className="d-flex align-items-center"
              >
                <CIcon icon={item.icon} className="me-3" style={{ width: '1.25rem', height: '1.25rem' }} />
                {item.label}
              </CNavLink>
            </CNavItem>
          ))}
        </CSidebarNav>
      </CSidebar>

      {/* Main Content */}
      <div className="flex-grow-1" style={styles.mainContent}>
        <CContainer fluid>
          {/* Alerts */}
          {error && (
            <CAlert color="danger" className="mb-4">
              {error}
            </CAlert>
          )}
          {success && (
            <CAlert color="success" className="mb-4">
              {success}
            </CAlert>
          )}

          {/* Content Sections */}
          {renderContent()}
        </CContainer>
      </div>

      {/* Edit Modal */}
      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader style={styles.cardHeader}>
          <CModalTitle>Edit Shipment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {editingShipment && (
            <CForm>
              <div className="mb-3">
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  value={editingShipment.status}
                  onChange={(e) => setEditingShipment({...editingShipment, status: e.target.value})}
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Condition</CFormLabel>
                <CFormSelect
                  value={editingShipment.condition}
                  onChange={(e) => setEditingShipment({...editingShipment, condition: e.target.value})}
                >
                  {conditionOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Current Country</CFormLabel>
                <CFormInput
                  type="text"
                  value={editingShipment.current_country}
                  onChange={(e) => setEditingShipment({...editingShipment, current_country: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Current State</CFormLabel>
                <CFormInput
                  type="text"
                  value={editingShipment.current_state}
                  onChange={(e) => setEditingShipment({...editingShipment, current_state: e.target.value})}
                />
              </div>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton style={styles.button} onClick={handleUpdate}>
            Update
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AdminDashboard;