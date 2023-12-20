import {
    Box,
    Button,
    Flex,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from "../features/auth/authSlice";
import toast from 'react-hot-toast';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Actions = ({ post }) => {
    const user = useSelector(selectCurrentUser);
    const [liked, setLiked] = useState(post.likes.includes(user?._id));
    const [posts, setPosts] = useState([]);
    const [isLiking, setIsLiking] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState("");
    const token = localStorage.getItem("token");

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleLikeAndUnlike = async () => {
        if (!token) return toast.error("Error", "You must be logged in to like a post", "error");
        if (isLiking) return;
        setIsLiking(true);
        try {
            const res = await fetch(`http://localhost:5000/api/posts/like/${post._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            if (data.error) return toast.error("Error", data.error, "error");

            if (!liked) {
                // add the id of the current user to post.likes array
                const updatedPosts = posts.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, likes: [...p.likes, user._id] };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            } else {
                // remove the id of the current user from post.likes array
                const updatedPosts = posts.map((p) => {
                    if (p._id === post._id) {
                        return { ...p, likes: p.likes.filter((id) => id !== user._id) };
                    }
                    return p;
                });
                setPosts(updatedPosts);
            }

            setLiked(prevLiked => !prevLiked);
        } catch (error) {
            toast.error("Error", error.message, "error");
        } finally {
            setIsLiking(false);
        }
    };

    const handleReply = async () => {
        if (!token) return toast.error("You must be logged in to reply to a post");
        if (isReplying) return;
        setIsReplying(true);
        try {
            const res = await fetch(`http://localhost:5000/api/posts/reply/${post._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ text: reply }),
            });
            const data = await res.json();
            if (data.error) return toast.error(data.error);

            const updatedPosts = posts.map((p) => {
                if (p._id === post._id) {
                    return { ...p, replies: [...p.replies, data] };
                }
                return p;
            });
            setPosts(updatedPosts);
            toast.success("Reply posted successfully");
            onClose();
            setReply("");
        } catch (error) {
            toast.error("Error", error.message, "error");
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <Flex flexDirection='column'>
            <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
                {liked ? <FavoriteIcon onClick={handleLikeAndUnlike} /> : <FavoriteBorderIcon onClick={handleLikeAndUnlike} />}

                <svg
                    aria-label='Comment'
                    color=''
                    fill=''
                    height='20'
                    role='img'
                    viewBox='0 0 24 24'
                    width='20'
                    onClick={onOpen}
                >
                    <title>Comment</title>
                    <path
                        d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
                        fill='none'
                        stroke='currentColor'
                        strokeLinejoin='round'
                        strokeWidth='2'
                    ></path>
                </svg>
            </Flex>

            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} fontSize='sm'>
                    {post.replies.length} replies
                </Text>
                <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                <Text color={"gray.light"} fontSize='sm'>
                    {post.likes.length} likes
                </Text>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Input
                                placeholder='Reply goes here..'
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' size={"sm"} mr={3} isLoading={isReplying} onClick={handleReply}>
                            Reply
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default Actions;