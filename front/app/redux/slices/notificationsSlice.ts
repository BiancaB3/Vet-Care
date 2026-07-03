import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VetCareNotificationType = 'cadastro' | 'edicao' | 'cancelamento';

export interface VetCareNotification {
  id: string;
  message: string;
  type: VetCareNotificationType;
}

interface NotificationsState {
  items: VetCareNotification[];
}

const initialState: NotificationsState = { items: [] };

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushNotification: (
      state,
      action: PayloadAction<{ message: string; type: VetCareNotificationType }>,
    ) => {
      state.items.push({
        id: `notif-${state.items.length}`,
        message: action.payload.message,
        type: action.payload.type,
      });
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { pushNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
