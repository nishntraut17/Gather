import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import toast from 'react-hot-toast';

const UserPage = () => {
    const { user, loading } = useGetUserProfile();
    const { username } = useParams();
    const [posts, setPosts] = useState([]);
    const [fetchingPosts, setFetchingPosts] = useState(true);

    useEffect(() => {
        const getPosts = async () => {
            if (!user) return;
            setFetchingPosts(true);
            try {
                const res = await fetch(`http://localhost:5000/api/posts/user/${username}`, { method: "GET", headers: { "authorization": `Bearer ${localStorage.getItem("token")}` } });
                const data = await res.json();
                console.log(data);
                setPosts(data);
            } catch (error) {
                toast.error("Error", error.message, "error");
                setPosts([]);
            } finally {
                setFetchingPosts(false);
            }
        };

        getPosts();
    }, [username, setPosts, user]);

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }

    if (!user && !loading) return <h1>User not found</h1>;

    return (
        <>
            <UserHeader user={user} />

            {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
            {fetchingPosts && (
                <Flex justifyContent={"center"} my={12}>
                    <Spinner size={"xl"} />
                </Flex>
            )}

            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    );
};

export default UserPage;
