import { Box, Container, Heading } from '@chakra-ui/react';

export const MyJobs = () => {
  return (
    <Box py={8}>
      <Container maxW="1200px">
        <Heading mb={6}>My Job Postings</Heading>
        {/* Add content here */}
      </Container>
    </Box>
  );
};
