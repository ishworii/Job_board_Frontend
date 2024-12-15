import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Stack,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { jobService } from '../services/job';
import { Application } from '../types';

const StatusBadge = ({ status }: { status: Application['status'] }) => {
  const colorScheme = {
    pending: 'yellow',
    accepted: 'green',
    rejected: 'red',
  }[status];

  return <Badge colorScheme={colorScheme}>{status}</Badge>;
};

export const Applications = () => {
  const [jobFilter, setJobFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: allApplications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await jobService.getAllApplications();
      console.log('Applications response:', response);
      return response;
    }
  });

  const { data: myJobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      const response = await jobService.getMyJobs();
      console.log('My Jobs response:', response);
      return response;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: number; status: Application['status'] }) =>
      jobService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      toast({
        title: 'Status updated',
        status: 'success',
        duration: 3000,
      });
    },
  });

  const handleUpdateStatus = (applicationId: number, status: Application['status']) => {
    updateStatusMutation.mutate({ applicationId, status });
  };
  const filterApplications = (applications: Application[]) => {
    console.log('Filtering applications:', applications);
    return applications.filter(app => {
      console.log('Checking application:', app);
      
      const matchesJob = !jobFilter || app.job_id.toString() === jobFilter;
      const matchesStatus = !statusFilter || app.status === statusFilter;
      const matchesSearch = !searchQuery || 
        (app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      console.log('Match results:', { matchesJob, matchesStatus, matchesSearch });
      
      return matchesJob && matchesStatus && matchesSearch;
    });
  };

  const filteredApplications = filterApplications(allApplications);

  if (applicationsLoading || jobsLoading) {
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
          <Heading>Manage Applications</Heading>

          <Card p={4}>
            <Stack spacing={4}>
              <HStack spacing={4}>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search applicants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>

                <Select
                  placeholder="Filter by job"
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                >
                  {myJobs.map((job) => (
                    <option key={job.id} value={job.id.toString()}>
                      {job.title}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </HStack>
            </Stack>
          </Card>

          <Card>
            <Tabs>
              <TabList px={4} pt={4}>
                <Tab>All Applications</Tab>
                <Tab>By Job</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {filteredApplications.length === 0 ? (
                    <Text p={4}>No applications found.</Text>
                  ) : (
                    <ApplicationTable
                      applications={filteredApplications}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  )}
                </TabPanel>

                <TabPanel>
                  <Stack spacing={6}>
                    {myJobs.map((job) => {
                      const jobApplications = filteredApplications.filter(
                        app => app.job && app.job.id === job.id
                      );

                      if (jobApplications.length === 0) {
                        return null;
                      }

                      return (
                        <Box key={job.id}>
                          <Heading size="md" mb={4}>
                            {job.title} ({jobApplications.length})
                          </Heading>
                          <ApplicationTable
                            applications={jobApplications}
                            onUpdateStatus={handleUpdateStatus}
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

const ApplicationTable = ({ 
  applications,
  onUpdateStatus 
}: { 
  applications: Application[];
  onUpdateStatus: (applicationId: number, status: Application['status']) => void;
}) => {
  console.log('Applications in table:', applications);

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Applicant</Th>
          <Th>Job Title</Th>
          <Th>Applied Date</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {applications.length === 0 ? (
          <Tr>
            <Td colSpan={5} textAlign="center">No applications found</Td>
          </Tr>
        ) : (
          applications.map((application) => (
            <Tr key={application.id}>
              <Td>
                <Stack spacing={0}>
                  <Text fontWeight="medium">{application.user?.name || 'N/A'}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {application.user?.email || 'N/A'}
                  </Text>
                </Stack>
              </Td>
              <Td>{application.job?.title || 'N/A'}</Td>
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
                    onClick={() => onUpdateStatus(application.id, 'accepted')}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    isDisabled={application.status === 'rejected'}
                    onClick={() => onUpdateStatus(application.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
};
