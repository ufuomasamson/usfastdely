import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TrackingForm = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track?number=${trackingNumber}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card shadow p-4 mx-auto mt-n5 position-relative"
      style={{maxWidth: 500, zIndex: 2, background: '#fff'}}
    >
      <label className="form-label fw-semibold mb-2">
        Enter Tracking Number
      </label>
      <div className="input-group">
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="e.g. TRK123456789"
          className="form-control"
          required
        />
        <button
          type="submit"
          className="btn btn-primary fw-semibold"
        >
          Track
        </button>
      </div>
    </form>
  );
};

export default TrackingForm; 