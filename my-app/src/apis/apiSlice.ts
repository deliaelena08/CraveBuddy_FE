import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../utils/urls";
import { isExpired } from "../utils/functions";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token && !isExpired()) {
        headers.set("app-auth", token);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
    credentials: "include",
  }),
  endpoints: () => ({}),
  tagTypes: ["users", "login", "bakeries"],
});
