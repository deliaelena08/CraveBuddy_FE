import { FavouriteDto } from "../entities/favourite/FavouriteDto";
import { favouriteBaseUrl } from "../utils/urls";
import { apiSlice } from "./apiSlice";

export const favouriteQueryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFavourites: builder.query<FavouriteDto[], void>({
      query: () => favouriteBaseUrl,
      providesTags: ["favourites"],
    }),

    getFavouriteById: builder.query<FavouriteDto, number>({
      query: (id) => `${favouriteBaseUrl}/${id}`,
      providesTags: (result, error, id) => [{ type: "favourites", id }],
    }),

    createFavourite: builder.mutation<FavouriteDto, FavouriteDto>({
      query: (favourite) => ({
        url: favouriteBaseUrl,
        method: "POST",
        body: favourite,
      }),
      invalidatesTags: ["favourites"],
    }),

    deleteFavourite: builder.mutation<void, number>({
      query: (id) => ({
        url: `${favouriteBaseUrl}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "favourites" }],
    }),

    getFavouritesByUserId: builder.query<FavouriteDto[], number>({
      query: (userId) => `${favouriteBaseUrl}/user/${userId}`,
      providesTags: ["favourites"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateFavouriteMutation,
  useDeleteFavouriteMutation,
  useGetFavouriteByIdQuery,
  useGetFavouritesQuery,
  useGetFavouritesByUserIdQuery,
} = favouriteQueryApi;
