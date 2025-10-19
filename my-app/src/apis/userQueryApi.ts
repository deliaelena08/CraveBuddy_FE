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
    logoutUser: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});
