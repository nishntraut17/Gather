import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from "../features/auth/authSlice";
import toast from 'react-hot-toast';
import { addPost } from "../features/post/postSlice";

const MAX_CHAR = 500;

const CreatePostOnHome = () => {
    const [postText, setPostText] = useState("");
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useSelector(selectCurrentUser);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

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
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Login is Required");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("https://gather-backend.onrender.com/api/posts/create", {
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
            dispatch(addPost(data));

            setPostText("");
            setImgUrl("");
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>

            <div className="flex flex-col p-4 bg-gray-100 border-slate-200 border-2 rounded">
                <div>
                    <FormControl>
                        <Textarea
                            placeholder='Create a Post..'
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
                    </FormControl >

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
                </div >

                <div className="flex justify-end">
                    <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                        Post
                    </Button>
                </div>
            </div >
        </div >
    )
}

export default CreatePostOnHome