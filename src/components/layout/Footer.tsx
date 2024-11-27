import { Box, Container, Icon, Link, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Logo } from '../common/Logo'

export const Footer = () => {
  return (
    <Box
      bg="white"
      borderTop="1px"
      borderColor="gray.100"
      py={10}
      mt="auto"
    >
      <Container maxW="1200px">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          <Stack spacing={6}>
            <Logo />
            <Text color="gray.500">
              Find your dream job or hire the best talent with JobHub.
            </Text>
            <Stack direction="row" spacing={4}>
              <Link href="#" color="gray.400" _hover={{ color: 'gray.600' }}>
                <Icon as={FaGithub} w={5} h={5} />
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: 'gray.600' }}>
                <Icon as={FaTwitter} w={5} h={5} />
              </Link>
              <Link href="#" color="gray.400" _hover={{ color: 'gray.600' }}>
                <Icon as={FaLinkedin} w={5} h={5} />
              </Link>
            </Stack>
          </Stack>

          <Stack>
            <Text fontWeight="500" fontSize="lg" mb={2}>Company</Text>
            <Link color="gray.500" _hover={{ color: 'teal.500' }}>About</Link>
            <Link color="gray.500" _hover={{ color: 'teal.500' }}>Careers</Link>
            <Link color="gray.500" _hover={{ color: 'teal.500' }}>Contact</Link>
          </Stack>

          <Stack>
            <Text fontWeight="500" fontSize="lg" mb={2}>Resources</Text>
            <Link color="gray.500" _hover={{ color: 'teal.500' }}>Blog</Link>
            <Link color="gray.500" _hover={{ color: 'teal.500' }}>Help Center</Link>
            <Link color="gray.500" _hover={{ color: 'teal.500' }}>Guidelines</Link>
          </Stack>

          <Stack>
            <Text fontWeight="500" fontSize="lg" mb={2}>Legal</Text>
            <Link color="gray.500" _hover={{ color: 'teal.500' }}>Privacy</Link>
            <Link color="gray.500" _hover={{ color: 'teal.500' }}>Terms</Link>
            <Link color="gray.500" _hover={{ color: 'teal.500' }}>Security</Link>
          </Stack>
        </SimpleGrid>

        <Box borderTopWidth={1} borderColor="gray.100" pt={8} mt={8}>
          <Text color="gray.500" fontSize="sm" textAlign="center">
            © {new Date().getFullYear()} JobHub. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  )
}
