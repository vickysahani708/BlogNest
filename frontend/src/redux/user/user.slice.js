import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
   user: {
    _id: '',
    name: '',
    email: '',
    avatar: '',
    bio: '',
    // Add other fields as needed
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state,action) => {
      const payload = action.payload
      state.isLoggedIn = true
      state.user = payload
    },
    removeUser: (state,action) => {
      
      state.isLoggedIn = false
      state.user = {}
    }

    },
})
export const {setUser,removeUser} = userSlice.actions
export default userSlice.reducer


