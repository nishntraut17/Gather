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
            toast.error("Error", "Please login to follow", "error");
            return;
        }
        if (updating) return;

        setUpdating(true);
        try {
            const res = await fetch(`http://localhost:5000/api/users/follow/${user._id}`, {
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
                toast.success("Success", `Unfollowed ${user.name}`, "success");
                user.followers.pop(); // simulate removing from followers
            } else {
                toast.success("Success", `Followed ${user.name}`, "success");
                user.followers.push(currentUser?._id); // simulate adding to followers
            }
            setFollowing(!following);

            console.log(data);
        } catch (error) {
            toast.error("Error", error, "error");
        } finally {
            setUpdating(false);
        }
    }
    return { handleFollowUnfollow, updating, following };
}

export default useFollowUnfollow;