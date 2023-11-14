import { Flex, Image, Text } from "@chakra-ui/react";
import LogoImg from "../assets/logo.png";
import { motion } from "framer-motion";

export default function Logo({ ...rest }) {
  const fontSize = {
    base: "xx-large",
    md: "xxx-large",
  };

  return (
    <Flex alignItems="center" {...rest}>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ height: "inherit" }}
      >
        <Image src={LogoImg} alt="Logo" h={"inherit"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        drag={true}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.01}
      >
        <Text
          fontSize={fontSize}
          fontWeight="bold"
          fontFamily={"Bungee"}
          ml={2}
          // Animations -- Appear from behind image
        >
          GymSense
        </Text>
      </motion.div>
    </Flex>
  );
}
