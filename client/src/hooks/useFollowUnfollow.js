import { useState } from 'react';
import toast from 'react-hot-toast';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useSelector } from 'react-redux';

const useFollowUnfollow = (user) => {
    const currentUser = useSelector(selectCurrentUser);
    const token = localStorage.getItem("token");
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
    const [updating, setUpdating] = useState(false);

    const handleFollowUnfollow = async () => {
        if (!token) {
            toast.error("Please login to follow");
            return;
        }
        if (updating) return;

        setUpdating(true);
        try {
            const res = await fetch(`https://gather-backend.onrender.com/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });
            const data = await res.json();
            if (data.error) {
                toast.error(data.error);
                return;
            }

            if (following) {
                toast.success(`Unfollowed ${user.name}`);
                user.followers.pop(); // simulate removing from followers
            } else {
                toast.success(`Followed ${user.name}`);
                user.followers.push(currentUser?._id); // simulate adding to followers
            }
            setFollowing(!following);

            console.log(data);
        } catch (error) {
            toast.error(error);
        } finally {
            setUpdating(false);
        }
    }
    return { handleFollowUnfollow, updating, following };
}

export default useFollowUnfollow;