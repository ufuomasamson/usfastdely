import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CContainer,
  CSpinner,
  CAlert,
  CRow,
  CCol,
  CBadge,
  CButton
} from "@coreui/react";
import { shipmentService } from "../config/supabase";

const TrackingResult = () => {
  const [searchParams] = useSearchParams();
  const trackingNumber = searchParams.get("number");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        if (!trackingNumber) {
          throw new Error("No tracking number provided");
        }
        const data = await shipmentService.getShipmentByTracking(trackingNumber);
        setShipment(data);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to fetch shipment");
        setShipment(null);
      } finally {
        setLoading(false);
      }
    };

    if (trackingNumber) {
      fetchShipment();
    } else {
      setError("No tracking number provided");
      setLoading(false);
    }
  }, [trackingNumber]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "success";
      case "in transit":
        return "primary";
      case "processing":
        return "info";
      case "delayed":
        return "warning";
      case "on hold":
        return "secondary";
      default:
        return "dark";
    }
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case "good":
        return "success";
      case "damaged":
        return "warning";
      case "lost":
        return "danger";
      default:
        return "dark";
    }
  };

  return (
    <div className="container-fluid bg-light py-5" style={{ minHeight: "100vh" }}>
      <CContainer>
        <CCard className="border-0 shadow">
          <CCardBody className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">Shipment Tracking</h2>
                <p className="text-muted mb-0">Track your shipment status and location</p>
              </div>
              <Link to="/">
                <CButton color="primary" variant="outline">
                  Track Another Package
                </CButton>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="primary" />
                <p className="text-muted mt-2">Loading shipment details...</p>
              </div>
            ) : error ? (
              <CAlert color="danger">{error}</CAlert>
            ) : shipment ? (
              <>
                <CRow className="mb-4">
                  <CCol xs={12}>
                    <div className="bg-primary bg-opacity-10 p-4 rounded">
                      <small className="text-muted d-block mb-1">Tracking Number</small>
                      <h3 className="mb-0 text-primary">{shipment.tracking_number}</h3>
                    </div>
                  </CCol>
                </CRow>

                <CRow className="mb-4">
                  <CCol md={6} className="mb-4 mb-md-0">
                    <div className="border rounded p-4 h-100">
                      <h5 className="mb-4">
                        <i className="fa fa-info-circle me-2 text-primary"></i>
                        Shipment Status
                      </h5>
                      <div className="mb-4">
                        <small className="text-muted d-block mb-2">Current Status</small>
                        <CBadge color={getStatusColor(shipment.status)} className="px-3 py-2" style={{ fontSize: '0.9rem' }}>
                          {shipment.status}
                        </CBadge>
                      </div>
                      <div>
                        <small className="text-muted d-block mb-2">Package Condition</small>
                        <CBadge color={getConditionColor(shipment.condition)} className="px-3 py-2" style={{ fontSize: '0.9rem' }}>
                          {shipment.condition}
                        </CBadge>
                      </div>
                    </div>
                  </CCol>

                  <CCol md={6}>
                    <div className="border rounded p-4 h-100">
                      <h5 className="mb-4">
                        <i className="fa fa-map-marker-alt me-2 text-primary"></i>
                        Current Location
                      </h5>
                      <div className="mb-4">
                        <small className="text-muted d-block mb-2">Country</small>
                        <p className="mb-0 fw-semibold">{shipment.current_country}</p>
                      </div>
                      <div>
                        <small className="text-muted d-block mb-2">State/Region</small>
                        <p className="mb-0 fw-semibold">{shipment.current_state}</p>
                      </div>
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={6} className="mb-4 mb-md-0">
                    <div className="border rounded p-4">
                      <h5 className="mb-4">
                        <i className="fa fa-user me-2 text-primary"></i>
                        Sender Details
                      </h5>
                      <div>
                        <small className="text-muted d-block mb-2">Name</small>
                        <p className="mb-3 fw-semibold">{shipment.sender_name}</p>
                        <small className="text-muted d-block mb-2">Origin</small>
                        <p className="mb-0 fw-semibold">{shipment.origin}</p>
                      </div>
                    </div>
                  </CCol>

                  <CCol md={6}>
                    <div className="border rounded p-4">
                      <h5 className="mb-4">
                        <i className="fa fa-user-check me-2 text-primary"></i>
                        Receiver Details
                      </h5>
                      <div>
                        <small className="text-muted d-block mb-2">Name</small>
                        <p className="mb-3 fw-semibold">{shipment.receiver_name}</p>
                        <small className="text-muted d-block mb-2">Destination</small>
                        <p className="mb-0 fw-semibold">{shipment.destination}</p>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              </>
            ) : null}
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default TrackingResult; 