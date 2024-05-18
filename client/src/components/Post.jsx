import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { selectCurrentUser } from '../features/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { deletePost } from "../features/post/postSlice";

const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState([]);
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${postedBy}`, {
                    headers: {
                        "authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                if (data.error) {
                    toast.error(data.error);
                    return;
                }
                setUser(data);
            } catch (error) {
                toast.error(error.message);
                setUser(null);
            }
        };

        getUser();
    }, [postedBy]);

    const handleDeletePost = async (e) => {
        try {
            e.preventDefault();
            if (!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${post._id}`, {
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
            dispatch(deletePost(post._id));
            toast.success("Post deleted");
        } catch (error) {
            toast.success(error.message);
        }
    };

    if (!user) return null;
    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar
                        size='md'
                        name={user.name}
                        src={user?.profilePic}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user.username}`);
                        }}
                    />
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text
                                fontSize={"sm"}
                                fontWeight={"bold"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${user.username}`);
                                }}
                            >
                                {user?.username}
                            </Text>
                            <Image src='/verified.png' w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>

                            {currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={post.img} w={"full"} />
                        </Box>
                    )}

                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;
