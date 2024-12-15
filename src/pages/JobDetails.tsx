import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Stack,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/job';

export const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [resumeUrl, setResumeUrl] = useState('');

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(Number(id)),
    enabled: !!id,
  });

  const applyMutation = useMutation({
    mutationFn: (applicationData: { resume_url?: string }) =>
      jobService.applyToJob(Number(id), applicationData),
    onSuccess: () => {
      toast({
        title: 'Application submitted',
        description: 'Your application has been successfully submitted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
      // Optionally navigate to applications page
      navigate('/my-applications');
    },
    onError: (error: any) => {
      toast({
        title: 'Application failed',
        description: error.response?.data?.detail || 'Failed to submit application',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'employer') {
      toast({
        title: 'Cannot apply',
        description: 'Employers cannot apply for jobs',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    onOpen();
  };

  const handleSubmitApplication = () => {
    applyMutation.mutate({ resume_url: resumeUrl });
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!job) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Job not found</Text>
      </Box>
    );
  }

  return (
    <Box bg="gray.100" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="800px">
        <Card>
          <CardBody>
            <Stack spacing={6}>
              <Box>
                <Heading size="lg" mb={2}>{job.title}</Heading>
                <Stack direction="row" spacing={2}>
                  <Badge colorScheme="blue">{job.category}</Badge>
                  <Badge colorScheme="green">{job.location}</Badge>
                </Stack>
              </Box>

              <Box>
                <Heading size="md" mb={2}>Job Description</Heading>
                <Text whiteSpace="pre-wrap">{job.description}</Text>
              </Box>

              <Box>
                <Heading size="md" mb={2}>Details</Heading>
                <Stack spacing={2}>
                  <Text>
                    <strong>Posted:</strong>{' '}
                    {new Date(job.created_at).toLocaleDateString()}
                  </Text>
                  <Text>
                    <strong>Location:</strong> {job.location}
                  </Text>
                  <Text>
                    <strong>Category:</strong> {job.category}
                  </Text>
                </Stack>
              </Box>

              {user?.role !== 'employer' && (
                <Button
                  colorScheme="teal"
                  size="lg"
                  onClick={handleApply}
                  isLoading={applyMutation.isLoading}
                >
                  Apply Now
                </Button>
              )}
            </Stack>
          </CardBody>
        </Card>

        {/* Application Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Apply for {job.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Resume URL (Optional)</FormLabel>
                <Input
                  placeholder="Enter link to your resume"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="teal"
                onClick={handleSubmitApplication}
                isLoading={applyMutation.isLoading}
              >
                Submit Application
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};
