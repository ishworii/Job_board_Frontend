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
  Select,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/job';

// Predefined categories and locations (you can modify these)
const categories = [
  'Software Development',
  'IT & Networking',
  'Design & Creative',
  'Sales & Marketing',
  'Customer Service',
  'Content & Writing',
  'Management',
  'Human Resources',
  'Digital Marketing',
  'Quality Assurance'
];

const locations = [
  'Kathmandu, Bagmati',
  'Lalitpur, Bagmati',
  'Bhaktapur, Bagmati',
  'Pokhara, Gandaki',
  'Birgunj, Madhesh',
  'Biratnagar, Province 1',
  'Butwal, Lumbini',
  'Dharan, Province 1',
  'Bharatpur, Bagmati',
  'Remote, Nepal'
];

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
}

export const CreateJob = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const toast = useToast();
  const navigate = useNavigate();

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;

    if (!title || title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!description || description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!location) {
      newErrors.location = 'Please select a location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    if (!validateForm(formData)) {
      setIsLoading(false);
      return;
    }

    const jobData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      location: formData.get('location') as string,
    };

    try {
      await jobService.createJob(jobData);
      
      toast({
        title: 'Job Created',
        description: 'Your job posting has been successfully created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate('/my-jobs');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create job posting';
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="gray.100" py={8} minH="calc(100vh - 64px)">
      <Container maxW="800px">
        <Card p={8} boxShadow="lg">
          <VStack spacing={6} align="stretch">
            <Heading size="lg">Create New Job Posting</Heading>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={!!errors.title}>
                  <FormLabel>Job Title</FormLabel>
                  <Input
                    name="title"
                    placeholder="e.g., Senior Frontend Developer"
                    bg="white"
                  />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.category}>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    placeholder="Select job category"
                    bg="white"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.category}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.location}>
                  <FormLabel>Location</FormLabel>
                  <Select
                    name="location"
                    placeholder="Select job location"
                    bg="white"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.location}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.description}>
                  <FormLabel>Job Description</FormLabel>
                  <Textarea
                    name="description"
                    placeholder="Provide a detailed description of the job..."
                    minH="200px"
                    bg="white"
                  />
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  isLoading={isLoading}
                  mt={4}
                >
                  Create Job Posting
                </Button>
              </VStack>
            </form>
          </VStack>
        </Card>
      </Container>
    </Box>
  );
};
