import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext.jsx";
import messageSound from "../assets/sounds/message.mp3";
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from "../features/auth/authSlice";
import { setConversationsBasedOnSelectedConversationId } from "../features/conversation/conversationSlice";

const MessageContainer = () => {
    const dispatch = useDispatch();
    const selectedConversation = useSelector((state) => state.conversation.selectedConversation);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const currentUser = useSelector(selectCurrentUser);
    const { socket } = useSocket();
    const messageEndRef = useRef(null);

    useEffect(() => {
        socket.on("newMessage", (message) => {
            if (selectedConversation._id === message.conversationId) {
                setMessages((prev) => [...prev, message]);
            }

            // make a sound if the window is not focused
            if (!document.hasFocus()) {
                const sound = new Audio(messageSound);
                sound.play();
            }

            //message.text, message.sender, message.conversationId
            dispatch(setConversationsBasedOnSelectedConversationId({ _id: message.conversationId, messageText: message.text, sender: message.sender }));
        });

        return () => socket.off("newMessage");
    }, [socket, selectedConversation, dispatch]);

    useEffect(() => {
        const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
        if (lastMessageIsFromOtherUser) {
            socket.emit("markMessagesAsSeen", {
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId,
            });
        }

        socket.on("messagesSeen", ({ conversationId }) => {
            if (selectedConversation._id === conversationId) {
                setMessages((prev) => {
                    const updatedMessages = prev.map((message) => {
                        if (!message.seen) {
                            return {
                                ...message,
                                seen: true,
                            };
                        }
                        return message;
                    });
                    return updatedMessages;
                });
            }
        });
    }, [socket, currentUser._id, messages, selectedConversation]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessages(true);
            setMessages([]);
            try {
                if (selectedConversation.mock) return;
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${selectedConversation.userId}`, {
                    headers: {
                        "authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                if (data.error) {
                    toast.error(data.error);
                    return;
                }
                setMessages(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingMessages(false);
            }
        };

        getMessages();
    }, [selectedConversation.userId, selectedConversation.mock]);

    return (
        <Flex
            flex='70'
            bg={"gray.200"}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
        >
            {/* Message header */}
            <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
                <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
                <Text display={"flex"} alignItems={"center"}>
                    {selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} />
                </Text>
            </Flex>

            <Divider />

            <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
                {loadingMessages &&
                    [...Array(5)].map((_, i) => (
                        <Flex
                            key={i}
                            gap={2}
                            alignItems={"center"}
                            p={1}
                            borderRadius={"md"}
                            alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
                        >
                            {i % 2 === 0 && <SkeletonCircle size={7} />}
                            <Flex flexDir={"column"} gap={2}>
                                <Skeleton h='8px' w='250px' />
                                <Skeleton h='8px' w='250px' />
                                <Skeleton h='8px' w='250px' />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={7} />}
                        </Flex>
                    ))}

                {!loadingMessages &&
                    messages.map((message) => (
                        <Flex
                            key={message._id}
                            direction={"column"}
                            ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
                        >
                            <Message message={message} ownMessage={currentUser._id === message.sender} />
                        </Flex>
                    ))}
            </Flex>

            <MessageInput setMessages={setMessages} />
        </Flex>
    );
};

export default MessageContainer;
