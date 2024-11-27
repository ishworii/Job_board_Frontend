import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FiBriefcase, FiFileText, FiLogOut, FiUser } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../common/Logo';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <Box 
      as="nav" 
      bg="white" 
      boxShadow="sm" 
      position="sticky" 
      top={0} 
      zIndex={100}
    >
      <Container maxW="1200px" py={4}>
        <Flex justify="space-between" align="center">
          <Logo />
          
          <HStack spacing={4}>
            {isAuthenticated ? (
              <>
                {user?.role === 'employer' ? (
                  // Employer navigation
                  <HStack spacing={4}>
                    <Button
                      as={RouterLink}
                      to="/profile"
                      variant="ghost"
                      leftIcon={<Icon as={FiUser} />}
                    >
                      Profile
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/create-job"
                      variant="ghost"
                      leftIcon={<Icon as={FiBriefcase} />}
                    >
                      Post a Job
                    </Button>
                    <Menu>
                      <MenuButton
                        as={Button}
                        variant="ghost"
                        leftIcon={<Icon as={FiFileText} />}
                      >
                        Manage Jobs
                      </MenuButton>
                      <MenuList>
                        <MenuItem as={RouterLink} to="/my-jobs">
                          My Job Postings
                        </MenuItem>
                        <MenuItem as={RouterLink} to="/applications">
                          View Applications
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                ) : (
                  // Job seeker navigation
                  <HStack spacing={4}>
                    <Button
                      as={RouterLink}
                      to="/profile"
                      variant="ghost"
                      leftIcon={<Icon as={FiUser} />}
                    >
                      Profile
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/my-applications"
                      variant="ghost"
                      leftIcon={<Icon as={FiFileText} />}
                    >
                      My Applications
                    </Button>
                  </HStack>
                )}
                <Button
                  onClick={logout}
                  colorScheme="teal"
                  variant="outline"
                  leftIcon={<Icon as={FiLogOut} />}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={RouterLink} 
                  to="/login"
                  variant="ghost"
                  colorScheme="teal"
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="teal"
                >
                  Sign Up
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
