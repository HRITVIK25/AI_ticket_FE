import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo: null,
  tickets: [] // Will be populated from GET API
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
    }
  },
})

export const { setUserInfo, clearUserInfo, addTicket, setTickets } = appSlice.actions

export default appSlice.reducer
