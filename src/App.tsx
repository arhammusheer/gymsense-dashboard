import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import notitificationSound from "./assets/notification.mp3";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Iot from "./pages/Iot";
import CreateNewIot from "./pages/IotNew";
import Login from "./pages/Login";
import Roles from "./pages/Roles";
import { authActions } from "./redux/slices/auth.slice";
import { notificationActions } from "./redux/slices/notification.slice";
import { RootState, useAppDispatch, useAppSelector } from "./redux/store";

const App = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.recoverSession());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/iot/new" element={<CreateNewIot />} />
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

const Notification = () => {
  const toast = useToast();
  const [audio] = useState(new Audio(notitificationSound));
  const notifications = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();

  // On new notification, show new toast with sound notification
  useEffect(() => {
    const unviewed = notifications.filter((n) => !n.viewed);

    if (unviewed.length > 0) {
      audio.play();
      unviewed.forEach((n) => {
        toast({
          title: "Update",
          description: n.message,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        dispatch(notificationActions.viewed(n.id));
      });
    }
  }, [notifications, toast, audio]);

  return null;
};

export default App;
