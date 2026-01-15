import { BrowserRouter, Routes, Route } from "react-router-dom";
import VehicleList from "./pages/VehicleList";
import VehicleDetail from "./pages/VehicleDetail";
import AlertHistory from "./pages/AlertHistory";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VehicleList />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/alerts" element={<AlertHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
