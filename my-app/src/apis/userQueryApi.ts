import { UserDto } from "../entities/user/UserDTO";
import { UserLoginDto } from "../entities/user/UserLoginDTO";
import { UserLoginResponse } from "../entities/user/UserLoginResponse";
import { UserRegisterDto } from "../entities/user/UserResgisterDto";
import { usersBaseUrl } from "../utils/urls";
import { apiSlice } from "./apiSlice";

export const userQueryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserDto[], void>({
      query: () => usersBaseUrl,
      providesTags: ["users"],
    }),

    getUserById: builder.query<UserDto, number>({
      query: (id) => `${usersBaseUrl}/${id}`,
      providesTags: (result, error, id) => [{ type: "users", id }],
    }),

    loginUser: builder.mutation<UserLoginResponse, UserLoginDto>({
      query: (user: UserLoginDto) => ({
        url: "/login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    registerUser: builder.mutation<UserLoginResponse, UserRegisterDto>({
      query: (user: UserRegisterDto) => ({
        url: "/signup",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    updateUser: builder.mutation<UserDto, { id: number; data: UserDto }>({
      query: ({ id, data }) => ({
        url: `${usersBaseUrl}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "users", id },
        "users",
      ],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `${usersBaseUrl}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    logoutUser: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLogoutUserMutation,
} = userQueryApi;
