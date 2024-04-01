import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import gymimage from "../assets/gym.jpg";
import FullCenter from "../components/utility/FullCenter";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  return (
    <Stack direction={["column", "column", "row"]} h="100vh">
      <Box w="100%" h="100%" color="white" display={["none", "none", "block"]}>
        <LeftPanel />
      </Box>
      <Box h="100%" w="100%" p={8}>
        <RightPanel />
      </Box>
    </Stack>
  );
}
const LeftPanel = () => {
  return (
    <Box position="relative" w="100%" h="100%">
      {/* Image */}
      <Image
        src={gymimage}
        alt="gym"
        w="100%"
        h="100%"
        objectFit="cover"
        p={3}
        borderRadius={"30px"}
      />

      {/* Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        backgroundColor="rgba(0,0,0,0.8)" // Adjust the alpha for desired darkness
      />

      {/* Hero Text */}
      <Stack
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        flexDirection="column"
        justify="center"
        p={8}
      >
        <Heading as="h1" size="4xl" fontWeight="bold" color="white">
          Elevate Your Workout
        </Heading>
        <Text color="white" fontSize="3xl">
          Track, Analyze, and Optimize with Ease
        </Text>
      </Stack>
    </Box>
  );
};

const RightPanel = () => {
  const {
    register,
    handleSubmit,
    formState: { isLoading },
  } = useForm();

  const { login, isAuthenticated, error } = useAuth();

  const [visible, setVisible] = useState(false);

  const onSubmit = (data: FieldValues) => {
    login(data.email, data.password);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <FullCenter>
      <Stack w="100%" maxW="400px" spacing={8}>
        <Heading as="h1" size="2xl" fontWeight="bold" mb={4}>
          Login
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="stretch" w="100%">
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                autoComplete="email"
                placeholder="john.doe@example.com"
                {...register("email", { required: true })}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={visible ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: true,
                  })}
                />
                <InputRightElement>
                  {visible ? (
                    <Icon as={FaEye} onClick={() => setVisible(!visible)} />
                  ) : (
                    <Icon
                      as={FaEyeSlash}
                      onClick={() => setVisible(!visible)}
                    />
                  )}
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Logging in"
              colorScheme="blue"
            >
              Login
            </Button>
            {error && <Text color="red.500">{error}</Text>}
          </VStack>
        </form>
      </Stack>
    </FullCenter>
  );
};
