import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo: null,
  tickets: [], // Will be populated from GET API
  knowledgeBases: [] // Will be populated from GET API
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
    addTicket: (state, action) => {
      // eslint-disable-next-line no-unused-vars
      const { updated_at, ...ticketData } = action.payload; // Store everything except updated_at
      state.tickets.unshift(ticketData);
    },
    setTickets: (state, action) => {
      // eslint-disable-next-line no-unused-vars
      state.tickets = action.payload.map(({ updated_at, ...ticketData }) => ticketData);
    },
    addKnowledgeBase: (state, action) => {
      state.knowledgeBases.unshift(action.payload);
    },
    setKnowledgeBases: (state, action) => {
      state.knowledgeBases = action.payload;
    },
    updateTicket: (state, action) => {
      const updated = action.payload;
      const idx = state.tickets.findIndex((t) => t.id === updated.id);
      if (idx !== -1) {
        state.tickets[idx] = { ...state.tickets[idx], ...updated };
      }
    }
  },
})

export const { setUserInfo, clearUserInfo, addTicket, setTickets, updateTicket, addKnowledgeBase, setKnowledgeBases } = appSlice.actions

export default appSlice.reducer
