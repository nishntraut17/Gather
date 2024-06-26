import { Avatar, Box, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import toast from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from "../features/auth/authSlice";

const PostPage = () => {
    const { user, loading } = useGetUserProfile();
    const [posts, setPosts] = useState([]);
    const { pid } = useParams();
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    const currentPost = posts[0];

    useEffect(() => {
        const getPost = async () => {
            setPosts([]);
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${pid}`, {
                    headers: {
                        "authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                if (data.error) {
                    toast.error(data.error);
                    return;
                }
                setPosts([data]);
            } catch (error) {
                toast.error(error.message);
            }
        };
        getPost();
    }, [pid]);

    const handleDeletePost = async () => {
        try {
            if (!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${currentPost._id}`, {
                method: "DELETE",
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            if (data.error) {
                toast.error(data.error);
                return;
            }
            toast.success("Post deleted");
            navigate(`/${user.username}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }

    if (!currentPost) return null;
    console.log("currentPost", currentPost);

    return (
        <>
            <Flex>
                <Flex w={"full"} alignItems={"center"} gap={3}>
                    <Avatar src={user.profilePic} size={"md"} />
                    <Flex>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {user.username}
                        </Text>
                        <Image src='/verified.png' w='4' h={4} ml={4} />
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={"center"}>
                    <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                        {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                    </Text>

                    {currentUser?._id === user._id && (
                        <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
                    )}
                </Flex>
            </Flex>

            <Text my={3}>{currentPost.text}</Text>

            {currentPost.img && (
                <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                    <Image src={currentPost.img} w={"full"} />
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Actions post={currentPost} />
            </Flex>

            <Divider my={4} />


            <Divider my={4} />
            {currentPost.replies.map((reply) => (
                <Comment
                    key={reply._id}
                    reply={reply}
                    lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
                />
            ))}
        </>
    );
};

export default PostPage;
