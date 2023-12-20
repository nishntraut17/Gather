import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from "../features/auth/authSlice";

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const token = localStorage.getItem('token');
    const user = useSelector(selectCurrentUser);
    const logout = useLogout();

    return (
        <Flex justifyContent={"space-between"} mt={6} mb='12'>
            {token && (
                <Link as={RouterLink} to='/'>
                    <AiFillHome size={24} />
                </Link>
            )}
            {!token && (
                <Link as={RouterLink} to={"/auth"}>
                    Login
                </Link>
            )}

            <Image
                cursor={"pointer"}
                alt='logo'
                w={6}
                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                onClick={toggleColorMode}
            />

            {token && (
                <Flex alignItems={"center"} gap={4}>
                    <Link as={RouterLink} to={`/${user.username}`}>
                        <RxAvatar size={24} />
                    </Link>
                    <Link as={RouterLink} to={`/chat`}>
                        <BsFillChatQuoteFill size={20} />
                    </Link>
                    <Button size={"xs"} onClick={logout}>
                        <FiLogOut size={20} />
                    </Button>
                </Flex>
            )}

            {!token && (
                <Link as={RouterLink} to={"/auth"}>
                    Sign up
                </Link>
            )}
        </Flex>
    );
};

export default Header;
