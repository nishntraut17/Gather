import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const user = useSelector(selectCurrentUser);

	useEffect(() => {
		const socket = io("https://gather-backend.onrender.com", {
			query: {
				userId: user?._id,
			},
		});

		setSocket(socket);

		socket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});
		return () => socket && socket.close();
	}, [user?._id]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
