import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import Home from "./pages/Home";
import UpdateProfile from "./pages/UpdateProfile";
import CreatePost from "./components/CreatePost";
import { setUserInfo } from "./features/auth/authSlice";
import { Toaster } from 'react-hot-toast';
import Login from "./pages/Login";
import Signup from './pages/Signup';
import { useDispatch } from 'react-redux';
import { jwtDecode } from "jwt-decode";
import ChatPage from "./pages/ChatPage";

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  if (token) {
    dispatch(setUserInfo(jwtDecode(token)));
  }

  const { pathname } = useLocation();
  return (
    <Box position={"relative"} w='full'>
      <Toaster />
      <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
        <Routes>
          <Route path='/' element={<Header />}>
            <Route path='/' element={token ? <Home /> : <Navigate to='/auth/login' />} />
            <Route path='/update' element={token ? <UpdateProfile /> : <Navigate to='/auth/login' />} />

            <Route
              path='/:username'
              element={
                token ? (
                  <>
                    <UserPage />
                    <CreatePost />
                  </>
                ) : (
                  <UserPage />
                )
              }
            />
            <Route path='/chat' element={token ? <ChatPage /> : <Navigate to={"/auth"} />} />
            <Route path='/:username/post/:pid' element={<PostPage />} />
          </Route>
          <Route path='/auth/signup' element={<Signup />} />
          <Route path='/auth/login' element={!token ? <Login /> : <Navigate to='/' />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
