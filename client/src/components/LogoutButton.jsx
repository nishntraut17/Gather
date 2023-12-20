import { Button } from "@chakra-ui/button";
import { FiLogOut } from "react-icons/fi";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../features/auth/authSlice';

const LogoutButton = () => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            localStorage.removeItem("token");
            dispatch(setUserInfo({}));
            toast.success("Logged out Successfully");
        } catch (error) {
            toast.error("Error while logging out")
        }
    };
    return (
        <Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
            <FiLogOut size={20} />
        </Button>
    );
};

export default LogoutButton;
