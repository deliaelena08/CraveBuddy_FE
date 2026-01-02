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

    deleteNotification: builder.mutation<void, number>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),

    deleteAllNotifications: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/notifications/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationQueryApi;
