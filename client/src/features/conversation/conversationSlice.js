import { createSlice } from '@reduxjs/toolkit'

const conversationReducer = createSlice({
    name: 'conversation',
    initialState: {
        conversations: [],
        selectedConversation: {
            _id: "",
            userId: "",
            username: "",
            userProfilePic: "",
        },
    },
    reducers: {
        setSelectedConversation: (state, action) => {
            return {
                ...state,
                selectedConversation: action.payload,
            };
        },
        setConversations: (state, action) => {
            return {
                ...state,
                conversations: action.payload,
            };
        },
        setConversationsBasedOnConversationId: (state, action) => {
            return {
                ...state,
                conversations: state.conversations.map((conversation) => {
                    if (conversation._id === action.payload) {
                        return {
                            ...conversation,
                            lastMessage: {
                                ...conversation.lastMessage,
                                seen: true,
                            },
                        };
                    }
                    return conversation;
                })
            }
        },
        setConversationsBasedOnSelectedConversationId: (state, action) => {
            return {
                ...state,
                conversations: state.conversations.map((conversation) => {
                    if (conversation._id === action.payload._id) {
                        return {
                            ...conversation,
                            lastMessage: {
                                ...conversation.lastMessage,
                                text: action.payload.messageText,
                                sender: action.payload.sender,
                            },
                        };
                    }
                    return conversation;
                })
            }
        },

    }
});

export const { setSelectedConversation, setConversations, setConversationsBasedOnConversationId, setConversationsBasedOnSelectedConversationId } = conversationReducer.actions
export default conversationReducer.reducer;