import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiBriefcase, FiMapPin, FiSearch, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useJobs } from '../hooks/useJobs';

export const Home = () => {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchParams, setSearchParams] = useState({ title: '', location: '' });
  
  const { data: jobs, isLoading, error } = useJobs(searchParams.title, searchParams.location);

  const handleSearch = () => {
    setSearchParams({ title: searchTitle, location: searchLocation });
  };

  return (
    <Box bg="gray.100">
      {/* Hero Section */}
      <Box 
        bg="linear-gradient(151deg, rgba(49, 151, 149, 0.1) 0%, rgba(178, 245, 234, 0.1) 100%)"
        py={20}
      >
        <Container maxW="1200px">
          <Stack spacing={8} maxW="800px" mx="auto" textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, teal.500, teal.300)"
              bgClip="text"
            >
              Find Your Dream Job in Nepal
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Discover the best job opportunities across Nepal
            </Text>

            <Box bg="white" p={6} borderRadius="xl" boxShadow="lg">
              <Stack spacing={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Job title or keyword" 
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMapPin} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Location" 
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </InputGroup>
                <Button 
                  colorScheme="teal" 
                  size="lg"
                  onClick={handleSearch}
                >
                  Search Jobs
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Jobs Section */}
      <Box py={16}>
        <Container maxW="1200px">
          <Heading mb={8}>Available Positions</Heading>
          
          {error ? (
            <Text color="red.500">Error loading jobs. Please try again later.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {isLoading ? (
                // Loading skeletons
                Array(6).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <Skeleton height="24px" width="80%" />
                        <Skeleton height="60px" />
                        <HStack>
                          <Skeleton height="20px" width="60px" />
                          <Skeleton height="20px" width="60px" />
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              ) : jobs?.map((job) => (
                <Card 
                  key={job.id} 
                  bg="white"
                  _hover={{ 
                    transform: 'translateY(-4px)', 
                    transition: 'all 0.2s',
                    boxShadow: 'lg'
                  }}
                >
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <Heading size="md" color="teal.600">
                        {job.title}
                      </Heading>
                      <Text color="gray.600" noOfLines={3}>
                        {job.description}
                      </Text>
                      <HStack>
                        <Badge colorScheme="blue">{job.category}</Badge>
                        <Badge colorScheme="green">{job.location}</Badge>
                      </HStack>
                      <Button 
                        colorScheme="teal" 
                        variant="outline" 
                        size="sm"
                      >
                        View Details
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      {/* Stats Section */}
      <Box bg="gray.50" py={16}>
        <Container maxW="1200px">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {[
              { icon: FiBriefcase, title: "Active Jobs", description: "Updated daily" },
              { icon: FiUsers, title: "Top Companies", description: "Hiring now" },
              { icon: FiTrendingUp, title: "Quick Apply", description: "Easy process" },
            ].map((stat, index) => (
              <Card key={index} bg="white">
                <CardBody>
                  <VStack spacing={4}>
                    <Icon as={stat.icon} w={8} h={8} color="teal.500" />
                    <Text fontWeight="bold" fontSize="xl">{stat.title}</Text>
                    <Text color="gray.500">{stat.description}</Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};
