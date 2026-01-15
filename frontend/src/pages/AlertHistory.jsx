import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const AlertHistory = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch alerts from backend
  useEffect(() => {
    API.get("/alerts")
      .then((res) => {
        setAlerts(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Alert fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Voice alert (text to speech)
  const speakAlert = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "hi-IN";
    window.speechSynthesis.speak(msg);
  };

  // Navigate to vehicle with alert session
  const watchAlertVideo = (alertId, vehicleId) => {
    navigate(`/vehicles/${vehicleId}?alertSession=${alertId}`);
  };

  // -------- UI STATES --------

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading alerts...</p>;
  }

  if (alerts.length === 0) {
    return <p style={{ padding: "20px" }}>No alerts yet</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚨 Alert History</h2>

      {alerts.map((a) => {
        // 🛑 SAFETY CHECK (MOST IMPORTANT FIX)
        if (!a.vehicle) return null;

        return (
          <div
            key={a._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <strong>Vehicle:</strong> {a.vehicle.vehicleNumber}
            <br />

            <strong>Driver:</strong> {a.vehicle.driverName}
            <br />

            <strong>Alert:</strong> {a.message}
            <br />

            {a.speed !== null && (
              <div>Speed: {a.speed} km/h</div>
            )}

            <div>Risk: {a.riskStatus}</div>

            <small>
              {new Date(a.createdAt).toLocaleString()}
            </small>

            <br /><br />

            <button
              onClick={() =>
                watchAlertVideo(a._id, a.vehicle._id)
              }
              disabled={a.videoAccessUsed}
            >
              {a.videoAccessUsed ? "Video Used" : "Watch Video"}
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => speakAlert(a.message)}
            >
              🔊 Listen
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AlertHistory;
