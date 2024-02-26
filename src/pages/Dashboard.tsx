import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const {  permissions } = useAuth();
  console.log(permissions);

  return (
    <Button
      onClick={() => {
        navigate("/role-management");
      }}
    >
      Navigate to role management
    </Button>
  );
}
