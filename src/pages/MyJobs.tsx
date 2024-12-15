import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { jobService } from '../services/job';
import { Application, Job } from '../types';

// Application Status Badge Component
const StatusBadge = ({ status }: { status: Application['status'] }) => {
  const colorScheme = {
    pending: 'yellow',
    accepted: 'green',
    rejected: 'red',
  }[status];

  return <Badge colorScheme={colorScheme}>{status}</Badge>;
};

// Applications Modal Component
const ApplicationsModal = ({ 
  isOpen, 
  onClose, 
  jobId, 
  jobTitle 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  jobId: number; 
  jobTitle: string;
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', jobId],
    queryFn: () => jobService.getJobApplications(jobId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: number; status: Application['status'] }) =>
      jobService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['applications', jobId]);
      toast({
        title: 'Status updated',
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to update status',
        status: 'error',
        duration: 3000,
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Applications for {jobTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {isLoading ? (
            <Box textAlign="center" py={4}>
              <Spinner />
            </Box>
          ) : !applications?.length ? (
            <Text>No applications yet.</Text>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Applicant</Th>
                  <Th>Applied On</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {applications.map((application) => (
                  <Tr key={application.id}>
                    <Td>
                      <Stack spacing={0}>
                        <Text fontWeight="medium">{application.user.name}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {application.user.email}
                        </Text>
                      </Stack>
                    </Td>
                    <Td>{new Date(application.applied_at).toLocaleDateString()}</Td>
                    <Td>
                      <StatusBadge status={application.status} />
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="green"
                          isDisabled={application.status === 'accepted'}
                          onClick={() => 
                            updateStatusMutation.mutate({
                              applicationId: application.id,
                              status: 'accepted'
                            })
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          isDisabled={application.status === 'rejected'}
                          onClick={() => 
                            updateStatusMutation.mutate({
                              applicationId: application.id,
                              status: 'rejected'
                            })
                          }
                        >
                          Reject
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const MyJobs = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: jobService.getMyJobs,
  });

  const handleViewApplications = (job: Job) => {
    setSelectedJob(job);
    onOpen();
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box bg="gray.100" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="1200px">
        <Stack spacing={6}>
          <Heading>My Job Postings</Heading>
          
          {!jobs?.length ? (
            <Card>
              <CardBody>
                <Text>You haven't posted any jobs yet.</Text>
              </CardBody>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <Heading size="md">{job.title}</Heading>
                  </CardHeader>
                  
                  <CardBody>
                    <Stack spacing={2}>
                      <HStack>
                        <Badge colorScheme="blue">{job.category}</Badge>
                        <Badge colorScheme="green">{job.location}</Badge>
                      </HStack>
                      <Text noOfLines={3}>{job.description}</Text>
                    </Stack>
                  </CardBody>

                  <CardFooter>
                    <Button
                      colorScheme="teal"
                      onClick={() => handleViewApplications(job)}
                      w="100%"
                    >
                      View Applications
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Stack>

        {selectedJob && (
          <ApplicationsModal
            isOpen={isOpen}
            onClose={onClose}
            jobId={selectedJob.id}
            jobTitle={selectedJob.title}
          />
        )}
      </Container>
    </Box>
  );
};
