import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from "../features/auth/authSlice";
import { setConversations, setSelectedConversation, setConversationsBasedOnConversationId } from "../features/conversation/conversationSlice";

const ChatPage = () => {
	const [searchingUser, setSearchingUser] = useState(false);
	const dispatch = useDispatch();
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [searchText, setSearchText] = useState("");
	const conversations = useSelector((state) => state.conversation.conversations)
	const selectedConversation = useSelector((state) => state.conversation.selectedConversation);

	const currentUser = useSelector(selectCurrentUser);
	const { socket, onlineUsers } = useSocket();

	useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			dispatch(setConversationsBasedOnConversationId(conversationId));
		});
	}, [socket, dispatch, setSearchText]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("http://localhost:5000/api/messages/conversations", {
					headers: {
						"authorization": `Bearer ${localStorage.getItem("token")}`
					}
				});
				const data = await res.json();
				if (data.error) {
					toast.error(data.error);
					return;
				}
				dispatch(setConversations(data));
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [dispatch, setSearchText]);

	const handleConversationSearch = async (e) => {
		e.preventDefault();
		setSearchingUser(true);
		try {
			const res = await fetch(`http://localhost:5000/api/users/profile/${searchText}`, {
				headers: {
					"authorization": `Bearer ${localStorage.getItem("token")}`
				}
			});
			const searchedUser = await res.json();
			if (searchedUser.error) {
				toast.error(searchedUser.error);
				return;
			}

			const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				toast.error("You cannot message yourself");
				return;
			}

			const conversationAlreadyExists = conversations.find(
				(conversation) => conversation.participants[0]._id === searchedUser._id
			);

			if (conversationAlreadyExists) {
				dispatch(setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				}));
				return;
			}

			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: searchedUser._id,
						username: searchedUser.username,
						profilePic: searchedUser.profilePic,
					},
				],
			};
			dispatch(setConversations([mockConversation]));
		} catch (error) {
			toast.error(error.message);
		} finally {
			setSearchingUser(false);
		}
	};

	return (
		<Box
			position={"absolute"}
			left={"50%"}
			w={{ base: "100%", md: "80%", lg: "750px" }}
			p={4}
			transform={"translateX(-50%)"}
		>
			<Flex
				gap={4}
				flexDirection={{ base: "column", md: "row" }}
				maxW={{
					sm: "400px",
					md: "full",
				}}
				mx={"auto"}
			>
				<Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
					<Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
						Your Conversations
					</Text>
					<form onSubmit={handleConversationSearch}>
						<Flex alignItems={"center"} gap={2}>
							<Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} />
							<Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>

					{loadingConversations &&
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
							</Flex>
						))}

					{!loadingConversations &&
						conversations.map((conversation) => (
							<Conversation
								key={conversation._id}
								isOnline={onlineUsers.includes(conversation.participants[0]._id)}
								conversation={conversation}
							/>
						))}
				</Flex>
				{!selectedConversation._id && (
					<Flex
						flex={70}
						borderRadius={"md"}
						p={2}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						height={"400px"}
					>
						<GiConversation size={100} />
						<Text fontSize={20}>Select a conversation to start messaging</Text>
					</Flex>
				)}

				{selectedConversation._id && <MessageContainer />}
			</Flex>
		</Box>
	);
};

export default ChatPage;
