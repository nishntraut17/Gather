import React from 'react'
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import SuggestedUser from "../components/SuggestedUser";
import toast from 'react-hot-toast';
import { Button, Flex, Box, Skeleton, SkeletonCircle } from '@chakra-ui/react';

const SearchPage = () => {
    const [users, setUsers] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            console.log(text);
            const res = await fetch(`http://localhost:5000/api/users/search/${text}`, {
                headers: {
                    "authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            setUsers(data);
            if (data.error) {
                toast.error(data.error);
                return;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='flex flex-col gap-6 '>
            <div className='flex flex-row gap-2 justify-center'>
                <input name='text' type='text' placeholder='Search for users' className='rounded w-72 h-8' onChange={(e) => setText(e.target.value)} />
                <Button size={"sm"} onClick={handleSubmit}>
                    <CiSearch />
                </Button>
            </div>
            {loading &&
                [0, 1].map((_, idx) => (
                    <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
                        <Box>
                            <SkeletonCircle size={"10"} />
                        </Box>
                        <Flex w={"full"} flexDirection={"column"} gap={2}>
                            <Skeleton h={"8px"} w={"80px"} />
                            <Skeleton h={"8px"} w={"90px"} />
                        </Flex>
                        <Flex>
                            <Skeleton h={"20px"} w={"60px"} />
                        </Flex>
                    </Flex>))
            }
            {!loading && users.map((user) => <SuggestedUser key={user._id} user={user} />)}
        </div>
    )
}

export default SearchPage