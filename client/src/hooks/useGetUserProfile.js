import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';

const useGetUserProfile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const { username } = useParams();

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch(`https://gather-backend.onrender.com/api/users/profile/${username}`, {
					headers: {
						"authorization": `Bearer ${localStorage.getItem("token")}`
					}
				});
				const data = await res.json();
				if (data.error) {
					toast.error(data.error);
					return;
				}
				if (data.isFrozen) {
					setUser(null);
					return;
				}
				setUser(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		getUser();
	}, [username, setUser]);

	return { loading, user };
};

export default useGetUserProfile;
