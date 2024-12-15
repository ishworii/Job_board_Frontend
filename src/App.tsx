import { Box } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { Applications } from './pages/Applications';
import { CreateJob } from './pages/CreateJob';
import { Home } from './pages/Home';
import { JobDetails } from './pages/JobDetails';
import { Login } from './pages/Login';
import { MyApplications } from './pages/MyApplications';
import { MyJobs } from './pages/MyJobs';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Box minH="100vh" display="flex" flexDirection="column" bg="gray.100">
            <Navbar />
            <Box flex="1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-job"
                  element={
                    <ProtectedRoute roleRequired="employer">
                      <CreateJob />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-jobs"
                  element={
                    <ProtectedRoute roleRequired="employer">
                      <MyJobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute roleRequired="employer">
                      <Applications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-applications"
                  element={
                    <ProtectedRoute roleRequired="job_seeker">
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-jobs"
                  element={
                    <ProtectedRoute roleRequired="employer">
                      <MyJobs />
                    </ProtectedRoute>
                  }
                />

                <Route path="/jobs/:id" element={<JobDetails />} />

                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute roleRequired="employer">
                      <Applications />
                    </ProtectedRoute>
                  }
                />


              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
