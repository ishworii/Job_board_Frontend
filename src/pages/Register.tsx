import {
    Box,
    Button,
    Card,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Radio,
    RadioGroup,
    Stack,
    Text,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { UserRole } from '../types/auth';

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('job_seeker');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const credentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      role,
    };

    try {
      await authService.register(credentials);
      
      toast({
        title: 'Registration successful',
        description: "Please login with your credentials",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate('/login');
    } catch (error: any) {
      // Handle different types of error responses
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data.detail) {
          // If it's a single error message
          toast({
            title: 'Registration failed',
            description: error.response.data.detail,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else if (typeof error.response.data === 'object') {
          // If it's validation errors
          setErrors(error.response.data);
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast({
          title: 'Registration failed',
          description: 'No response from server. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Something happened in setting up the request
        toast({
          title: 'Registration failed',
          description: 'An unexpected error occurred. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="gray.100" minH="calc(100vh - 64px)" py={12}>
      <Container maxW="md">
        <Card p={8} boxShadow="lg">
          <VStack spacing={6}>
            <Heading size="lg">Create an Account</Heading>
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    placeholder="Enter your full name"
                    bg="white"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    bg="white"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    bg="white"
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <FormControl as="fieldset" isRequired isInvalid={!!errors.role}>
                  <FormLabel as="legend">Account Type</FormLabel>
                  <RadioGroup value={role} onChange={(value: UserRole) => setRole(value)}>
                    <Stack direction="row" spacing={4}>
                      <Radio value="job_seeker">Job Seeker</Radio>
                      <Radio value="employer">Employer</Radio>
                    </Stack>
                  </RadioGroup>
                  <FormErrorMessage>{errors.role}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  isLoading={isLoading}
                  w="100%"
                >
                  Register
                </Button>
              </VStack>
            </form>

            <Text>
              Already have an account?{' '}
              <Button
                as={RouterLink}
                to="/login"
                variant="link"
                colorScheme="teal"
              >
                Sign in
              </Button>
            </Text>
          </VStack>
        </Card>
      </Container>
    </Box>
  );
};
