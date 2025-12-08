import { NotificationDto } from "../entities/notification/NotificationDto";
import { apiSlice } from "./apiSlice";

export const notificationQueryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationDto[], number>({
      query: (userId) => `/notifications/user/${userId}`,
      providesTags: ["notifications"],
    }),

    createNotification: builder.mutation<
      void,
      { userId: number; message: string; type: string }
    >({
      query: ({ userId, message, type }) => ({
        url: `/notifications/${userId}`,
        method: "POST",
        body: { message, type },
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useCreateNotificationMutation } =
  notificationQueryApi;
