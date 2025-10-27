import { BakeryDto } from "../entities/bakery/BakeryDto";
import { bakeriesBaseUrl } from "../utils/urls";
import { apiSlice } from "./apiSlice";

export const bakeryQueryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBakeries: builder.query<BakeryDto[], void>({
      query: () => bakeriesBaseUrl,
      providesTags: ["bakeries"],
    }),

    getBakeryById: builder.query<BakeryDto, number>({
      query: (id) => `${bakeriesBaseUrl}/${id}`,
      providesTags: (result, error, id) => [{ type: "bakeries", id }],
    }),

    createBakery: builder.mutation<BakeryDto, BakeryDto>({
      query: (bakeryDto) => ({
        url: bakeriesBaseUrl,
        method: "POST",
        body: bakeryDto,
      }),
      invalidatesTags: ["bakeries"],
    }),

    deleteBakery: builder.mutation<void, number>({
      query: (id) => ({
        url: `${bakeriesBaseUrl}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "bakeries" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBakeriesQuery,
  useGetBakeryByIdQuery,
  useCreateBakeryMutation,
  useDeleteBakeryMutation,
} = bakeryQueryApi;
