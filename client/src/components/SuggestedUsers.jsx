import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import toast from 'react-hot-toast';

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/suggested`, {
                    headers: {
                        "authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await res.json();
                if (data.error) {
                    toast.error(data.error);
                    return;
                }
                setSuggestedUsers(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getSuggestedUsers();
    }, [setSuggestedUsers]);

    return (
        <>
            <Text mb={4} fontWeight={"bold"}>
                Suggested Users
            </Text>
            <Flex direction={"column"} gap={4}>
                {!loading && suggestedUsers.map((user) => <SuggestedUser key={user._id} user={user} />)}
                {loading &&
                    [0, 1, 2, 3, 4].map((_, idx) => (
                        <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
                            {/* avatar skeleton */}
                            <Box>
                                <SkeletonCircle size={"10"} />
                            </Box>
                            {/* username and fullname skeleton */}
                            <Flex w={"full"} flexDirection={"column"} gap={2}>
                                <Skeleton h={"8px"} w={"80px"} />
                                <Skeleton h={"8px"} w={"90px"} />
                            </Flex>
                            {/* follow button skeleton */}
                            <Flex>
                                <Skeleton h={"20px"} w={"60px"} />
                            </Flex>
                        </Flex>
                    ))}
            </Flex>
        </>
    );
};

export default SuggestedUsers;
