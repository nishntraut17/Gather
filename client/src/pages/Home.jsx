import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast'
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";
import CreatePostOnHome from "../components/CreatePostOnHome";
import { setPosts, selectCurrentPosts } from "../features/post/postSlice";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const posts = useSelector(selectCurrentPosts);
    const dispatch = useDispatch();
    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch("https://gather-backend.onrender.com/api/posts/feed", {
                    headers: {
                        "authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                if (data.error) {
                    toast.error(data.error);
                    return;
                }
                console.log(data);
                const sortedData = data.sort(function (a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                console.log(sortedData);
                dispatch(setPosts(sortedData));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        getFeedPosts();
    }, [dispatch]);

    return (
        <Flex gap='10' alignItems={"flex-start"}>
            <Box flex={70}>
                <CreatePostOnHome />
                {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

                {loading && (
                    <Flex justify='center'>
                        <Spinner size='xl' />
                    </Flex>
                )}

                {posts.map((post) => (
                    <Post key={post._id} post={post} postedBy={post.postedBy} />
                ))}
            </Box>
            <Box
                flex={30}
                display={{
                    base: "none",
                    md: "block",
                }}
            >
                <SuggestedUsers />
            </Box>
        </Flex>
    );
};

export default Home;
