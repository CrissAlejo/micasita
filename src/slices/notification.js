import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
    notifications: []
};

const slice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        getNotifications(state, action) {
            const { notifications } = action.payload;
            state.notifications = notifications;
        },
    }
});

export const reducer = slice.reducer;

export const getNotifications = () => async (dispatch) => {

    dispatch(true);
};

export default slice;
