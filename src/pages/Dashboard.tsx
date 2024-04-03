import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

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
