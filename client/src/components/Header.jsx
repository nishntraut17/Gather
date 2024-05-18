import { Button, Flex, Image, Link } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import useLogout from "../hooks/useLogout";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from "../features/auth/authSlice";
import { Outlet } from 'react-router-dom';

const Header = () => {
    const token = localStorage.getItem('token');
    const user = useSelector(selectCurrentUser);
    const logout = useLogout();

    return (
        <div className="">
            <Flex justifyContent={"space-between"} mt={6} mb='12'>
                {token && (
                    <Link as={RouterLink} to='/'>
                        <AiFillHome size={24} />
                    </Link>
                )}

                <Flex cursor={"pointer"}>
                    <Image
                        alt='logo'
                        w={8}
                        h={8}
                        src={"/GatherFinal.png"}

                    />
                    <p className="text-sm pt-1 pl-1">Gather</p>
                </Flex>

                {token && (
                    <Flex alignItems={"center"} gap={4}>
                        <Link as={RouterLink} to="/search">
                            <CiSearch size={24} />
                        </Link>
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
                    <Link as={RouterLink} to={"/auth/login"}>
                        Login
                    </Link>
                )}
            </Flex>
            <Outlet />
        </div>
    );
};

export default Header;
