import { Box, Container } from "@chakra-ui/react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import Home from "./pages/Home";
import UpdateProfile from "./pages/UpdateProfile";
import CreatePost from "./components/CreatePost";
import { selectCurrentUser } from "./features/auth/authSlice";
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Login from "./pages/Login";
import Signup from './pages/Signup';

function App() {
  const user = useSelector(selectCurrentUser);
  const token = localStorage.getItem("token");
  const { pathname } = useLocation();
  return (
    <Box position={"relative"} w='full'>
      <Toaster />
      <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
        <Header />
        <Routes>
          <Route path='/' element={token ? <Home /> : <Navigate to='/auth/login' />} />
          <Route path='/auth/login' element={!token ? <Login /> : <Navigate to='/' />} />
          <Route path='/update' element={token ? <UpdateProfile /> : <Navigate to='/auth/login' />} />

          <Route
            path='/:username'
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path='/:username/post/:pid' element={<PostPage />} />
          <Route path='/auth/signup' element={<Signup />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
