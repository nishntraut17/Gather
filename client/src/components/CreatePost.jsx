import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from "../features/auth/authSlice";
import toast from 'react-hot-toast';

const MAX_CHAR = 500;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState("");
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useSelector(selectCurrentUser);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const { username } = useParams();

    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleCreatePost = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
            });

            const data = await res.json();
            if (data.error) {
                toast.error(data.error);
                return;
            }
            toast.success("Post created successfully");
            if (username === user.username) {
                setPosts([data, ...posts]);
            }
            onClose();
            setPostText("");
            setImgUrl("");
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={5}
                bg={"gray.300"}
                onClick={onOpen}
                size={{ base: "sm", sm: "md" }}
            >
                <AddIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder='Post content goes here..'
                                onChange={handleTextChange}
                                value={postText}
                            />
                            <Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                            <Input type='file' hidden ref={imageRef} onChange={handleImageChange} />

                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={16}
                                onClick={() => imageRef.current.click()}
                            />
                        </FormControl>

                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt='Selected img' />
                                <CloseButton
                                    onClick={() => {
                                        setImgUrl("");
                                    }}
                                    bg={"gray.800"}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;
