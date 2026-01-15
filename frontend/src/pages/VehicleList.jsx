import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  // Load all vehicles on page load
  useEffect(() => {
    API.get("/vehicles")
      .then((res) => setVehicles(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚚 Vehicles</h2>

      {vehicles.map((v) => (
        <div
          key={v._id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/vehicles/${v._id}`)}
        >
          <strong>{v.vehicleNumber}</strong>
          <div>Driver: {v.driverName}</div>
          <div>Risk: {v.riskStatus}</div>
        </div>
      ))}
    </div>
  );
};

export default VehicleList;
