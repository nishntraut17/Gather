import {
    Avatar,
    AvatarBadge,
    Box,
    Flex,
    Image,
    Stack,
    Text,
    WrapItem,
} from "@chakra-ui/react";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from "../features/auth/authSlice";
import { setSelectedConversation } from "../features/conversation/conversationSlice";

const Conversation = ({ conversation, isOnline }) => {
    const dispatch = useDispatch();
    const user = conversation.participants[0];
    const currentUser = useSelector(selectCurrentUser);
    const lastMessage = conversation.lastMessage;

    const selectedConversation = useSelector((state) => state.conversation.selectedConversation);

    console.log("selectedConverstion", selectedConversation);
    return (
        <Flex
            gap={4}
            alignItems={"center"}
            p={"1"}
            _hover={{
                cursor: "pointer",
                bg: "gray.600",
                color: "white",
            }}
            onClick={() =>
                dispatch(setSelectedConversation({
                    _id: conversation._id,
                    userId: user._id,
                    userProfilePic: user.profilePic,
                    username: user.username,
                    mock: conversation.mock,
                }))
            }
            bg={
                selectedConversation?._id === conversation._id ? "gray.400" : ""
            }
            borderRadius={"md"}
        >
            <WrapItem>
                <Avatar
                    size={{
                        base: "xs",
                        sm: "sm",
                        md: "md",
                    }}
                    src={user.profilePic}
                >
                    {isOnline ? <AvatarBadge boxSize='1em' bg='green.500' /> : ""}
                </Avatar>
            </WrapItem>

            <Stack direction={"column"} fontSize={"sm"}>
                <Text fontWeight='700' display={"flex"} alignItems={"center"}>
                    {user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
                </Text>
                <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
                    {currentUser._id === lastMessage.sender ? (
                        <Box color={lastMessage.seen ? "blue.400" : ""}>
                            <BsCheck2All size={16} />
                        </Box>
                    ) : (
                        ""
                    )}
                    {lastMessage.text.length > 18
                        ? lastMessage.text.substring(0, 18) + "..."
                        : lastMessage.text || <BsFillImageFill size={16} />}
                </Text>
            </Stack>
        </Flex>
    );
};

export default Conversation;
