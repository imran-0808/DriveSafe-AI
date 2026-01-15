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
      {/* Alert */}
      <div>
        <br /><br /><br />
        🚨 <button style={{ color: "black", backgroundColor: "lightgray", height: "40px", width: "100px" }}><b><a href="http://localhost:5173/alerts">ALERT</a></b></button>
      </div>
    </div>
  );
};

export default VehicleList;
