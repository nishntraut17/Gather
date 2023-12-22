import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUser = ({ user }) => {
    const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

    return (
        <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
            {/* left side */}
            <Link to={`/${user.username}`}>
                <Flex gap={2}>
                    <Avatar src={user.profilePic} />
                    <Box>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {user.username}
                        </Text>
                        <Text color={"gray.light"} fontSize={"sm"}>
                            {user.name}
                        </Text>
                    </Box>
                </Flex>
            </Link>
            {/* right side */}
            <Button
                size={"sm"}
                color={following ? "black" : "white"}
                bg={following ? "white" : "blue.400"}
                onClick={handleFollowUnfollow}
                isLoading={updating}
                _hover={{
                    color: following ? "black" : "white",
                    opacity: ".8",
                }}
            >
                {following ? "Unfollow" : "Follow"}
            </Button>
        </Flex>
    );
};

export default SuggestedUser;
