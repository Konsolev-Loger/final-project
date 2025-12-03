import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  from: 'assistant' | 'user';
  text: string;
}

export interface AIChatState {
  isOpen: boolean;
  messages: Message[];
}

const initialState: AIChatState = {
  isOpen: false,
  messages: [],
};

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    openChat(state) {
      state.isOpen = true;
    },
    closeChat(state) {
      state.isOpen = false;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    resetMessages(state) {
      state.messages = [];
    },
  },
});

export const { openChat, closeChat, addMessage, resetMessages } = aiChatSlice.actions;
export default aiChatSlice.reducer;
