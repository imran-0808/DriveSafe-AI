import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import API from "../services/api";

const VehicleDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const alertSessionId = searchParams.get("alertSession");

  /* ===========================
     BASIC STATES
  =========================== */
  const [vehicle, setVehicle] = useState(null);

  /* ===========================
     DRIVER EDIT STATES
  =========================== */
  const [editMode, setEditMode] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  /* ===========================
     VIDEO SESSION STATES
  =========================== */
  const [session, setSession] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  /* ===========================
     FETCH VEHICLE DATA
  =========================== */
  useEffect(() => {
    const fetchVehicle = () => {
      API.get(`/vehicles/${id}`)
        .then((res) => {
          setVehicle(res.data);
          setDriverName(res.data.driverName || "");
          setDriverPhone(res.data.driverPhone || "");
        })
        .catch(console.error);
    };

    fetchVehicle();
    const interval = setInterval(fetchVehicle, 5000);
    return () => clearInterval(interval);
  }, [id]);

  /* ===========================
     START VIDEO SESSION (FIXED)
  =========================== */
  const startVideoSession = async () => {
    try {
      const res = await API.post("/video-sessions/start", {
        vehicleId: id,
      });

      setSession(res.data);

      const expiresAt = new Date(res.data.expiresAt).getTime();
      const now = Date.now();
      setRemainingTime(Math.floor((expiresAt - now) / 1000));

      // 🔥 VIDEO OPEN (ONLY FIX)
      window.open("http://localhost:8000/video", "_blank");
    } catch (err) {
      alert(err.response?.data?.message || "Cannot start session");
    }
  };

  /* ===========================
     ALERT VIDEO SESSION (FIXED)
  =========================== */
  useEffect(() => {
    if (!alertSessionId) return;

    const startAlertVideoSession = async () => {
      try {
        const res = await API.post(
          "/video-sessions/start-from-alert",
          { alertId: alertSessionId }
        );

        setSession(res.data);

        const expiresAt = new Date(res.data.expiresAt).getTime();
        const now = Date.now();
        setRemainingTime(Math.floor((expiresAt - now) / 1000));

        // 🔥 VIDEO OPEN (ONLY FIX)
        window.open("http://localhost:8000/video", "_blank");
      } catch (err) {
        alert(err.response?.data?.message || "Alert video cannot be started");
      }
    };

    startAlertVideoSession();
  }, [alertSessionId]);

  /* ===========================
     SESSION TIMER
  =========================== */
  useEffect(() => {
    if (!remainingTime) return;

    const timer = setInterval(() => {
      setRemainingTime((t) => {
        if (t === 31) alert("⚠ Video session ending in 30 seconds");
        if (t <= 1) {
          setSession(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  /* ===========================
     UPDATE DRIVER
  =========================== */
  const updateDriver = async () => {
    try {
      const res = await API.put(`/vehicles/${id}/driver`, {
        driverName,
        driverPhone,
      });
      setVehicle(res.data);
      setEditMode(false);
      alert("Driver updated successfully");
    } catch (err) {
      alert(err.msg,  "Driver update failed");
    }
  };

  if (!vehicle) return <p>Loading...</p>;

  /* ===========================
     UI
  =========================== */
  return (
    <div style={{ padding: "20px" }}>
      <h2>🚛 {vehicle.vehicleNumber}</h2>

      <h3>👨‍✈️ Driver Details</h3>

      {editMode ? (
        <>
          <input
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="Driver Name"
          />
          <br />
          <input
            value={driverPhone}
            onChange={(e) => setDriverPhone(e.target.value)}
            placeholder="Driver Phone"
          />
          <br />
          <button onClick={updateDriver}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {vehicle.driverName}</p>
          <p>
            <strong>Phone:</strong>{" "}
            <a href={`tel:${vehicle.driverPhone}`}>
              {vehicle.driverPhone}
            </a>
          </p>
          <button onClick={() => setEditMode(true)}>Change Driver</button>
        </>
      )}

      <hr />

      <p><strong>Speed:</strong> {vehicle.speed} km/h</p>
      <p><strong>Location:</strong> {vehicle.location}</p>
      <p><strong>Risk:</strong> {vehicle.riskStatus}</p>

      <hr />

      {!alertSessionId && !session && (
        <button onClick={startVideoSession}>
          Start Video Session
        </button>
      )}

      {session && (
        <>
          <p>🟢 Session Active</p>
          <p>⏳ Ends in: {remainingTime}s</p>
        </>
      )}
      {/* Alert */}
      <div>
        <br /><br /><br />
        🚨 <button style={{ color: "black", backgroundColor: "lightgray", height: "40px", width: "100px" }}><b><a href="http://localhost:5173/alerts">ALERT</a></b></button>
      </div>
    </div>
  );
};

export default VehicleDetail;
