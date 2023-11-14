import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Logo from "./components/Logo";

const App = () => {
  return (
    <Box>
      <Navbar logo={<Logo h={"inherit"} />}></Navbar>
    </Box>
  );
};

export default App;
