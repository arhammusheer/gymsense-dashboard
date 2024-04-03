import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Iot from "./pages/Iot";
import Login from "./pages/Login";
import Roles from "./pages/Roles";
import { RootState } from "./redux/store";
const App = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/iot/:id" element={<Iot />} />
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/role-management" element={<Roles />} />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
