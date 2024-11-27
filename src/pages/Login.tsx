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
    Text,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { authService } from '../services/auth';

export const Login = () => {
    const { setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const credentials = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        };

        try {
            // First get the token
            const tokenData = await authService.login(credentials);
            
            // Set the token in axios headers for subsequent requests
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenData.access_token}`;
            
            // Fetch user profile
            const { data: userData } = await api.get('/profile');
            setUser(userData);

            toast({
                title: 'Login successful',
                description: `Welcome back, ${userData.name}!`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            navigate('/');
        } catch (error: any) {
            if (error.response) {
                // Handle specific error messages from the API
                const errorMessage = error.response.data?.detail || 'Invalid credentials';
                setError(errorMessage);
                toast({
                    title: 'Login failed',
                    description: errorMessage,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                setError('An error occurred. Please try again.');
                toast({
                    title: 'Login failed',
                    description: 'An error occurred. Please try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
            
            // Clear any existing auth tokens on error
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box bg="gray.100" minH="calc(100vh - 64px)" py={12}>
            <Container maxW="md">
                <Card p={8} boxShadow="lg">
                    <VStack spacing={6}>
                        <Heading size="lg">Welcome Back</Heading>

                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <VStack spacing={4} align="stretch">
                                <FormControl isRequired isInvalid={!!error}>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        bg="white"
                                    />
                                </FormControl>

                                <FormControl isRequired isInvalid={!!error}>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        bg="white"
                                    />
                                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="teal"
                                    size="lg"
                                    isLoading={isLoading}
                                    w="100%"
                                >
                                    Sign In
                                </Button>
                            </VStack>
                        </form>

                        <Text>
                            Don't have an account?{' '}
                            <Button
                                as={RouterLink}
                                to="/register"
                                variant="link"
                                colorScheme="teal"
                            >
                                Sign up
                            </Button>
                        </Text>
                    </VStack>
                </Card>
            </Container>
        </Box>
    );
};
