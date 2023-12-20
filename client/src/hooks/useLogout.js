import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../features/auth/authSlice';

const useLogout = () => {
	const dispatch = useDispatch();

	const logout = () => {
		try {
			localStorage.removeItem("token");
			dispatch(setUserInfo({}));
			toast.success("Logged out Successfully");
		} catch (error) {
			toast.error("Error while logging out")
		}
	};

	return logout;
};

export default useLogout;
