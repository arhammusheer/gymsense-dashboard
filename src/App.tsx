import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import notitificationSound from "./assets/notification.mp3";
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
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );
  const focused = useAppSelector((state) => state.notifications.focused);
  const granted = useAppSelector((state) => state.notifications.isGranted);
  const dispatch = useAppDispatch();

  // On new notification, show new toast with sound notification
  useEffect(() => {
    const unviewed = notifications.filter((n) => !n.viewed);
    // If the browser is focused or the notification is not granted, only in-app notification is available
    if ((focused || !granted) && unviewed.length > 0) {
      // Delay the notification to show after the toast

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

    // If the browser is not focused and the notification is granted, play sound and show notification
    if (!focused && unviewed.length > 0 && granted) {
      audio.play();
      const notification = new window.Notification("Update", {
        body: unviewed[0].message,
      });
      notification.onclick = () => {
        dispatch(notificationActions.viewed(unviewed[0].id));
      };
    }
  }, [notifications, toast, audio, dispatch, focused, granted]);

  // Focus and away event listeners
  useEffect(() => {
    const onFocus = () => dispatch(notificationActions.focus());
    const onBlur = () => dispatch(notificationActions.away());

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    // Handle first focus event
    if (document.hasFocus()) {
      dispatch(notificationActions.focus());
    } else {
      dispatch(notificationActions.away());
    }

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, [dispatch]);

  return null;
};

export default App;
