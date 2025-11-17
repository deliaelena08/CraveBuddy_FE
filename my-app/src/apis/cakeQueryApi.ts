import { CakeDto } from "../entities/cake/CakeDto";
import { cakeBaseUrl } from "../utils/urls";
import { apiSlice } from "./apiSlice";

export const cakeQueryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCakes: builder.query<CakeDto[], void>({
      query: () => cakeBaseUrl,
      providesTags: ["cakes"],
    }),

    getCakeById: builder.query<CakeDto, number>({
      query: (id) => `${cakeBaseUrl}/${id}`,
      providesTags: (result, error, id) => [{ type: "cakes", id }],
    }),

    createCake: builder.mutation<CakeDto, CakeDto>({
      query: (cakeDto) => ({
        url: cakeBaseUrl,
        method: "POST",
        body: cakeDto,
      }),
      invalidatesTags: ["cakes"],
    }),

    deleteCake: builder.mutation<void, number>({
      query: (id) => ({
        url: `${cakeBaseUrl}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "cakes" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCakeMutation,
  useDeleteCakeMutation,
  useGetCakeByIdQuery,
  useGetCakesQuery,
} = cakeQueryApi;
