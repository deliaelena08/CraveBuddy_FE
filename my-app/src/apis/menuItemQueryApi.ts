import { MenuItemDto } from "../entities/menuItem/MenuItemDto";
import { menuItemsBaseUrl } from "../utils/urls";
import { apiSlice } from "./apiSlice";

export const menuItemQueryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenuItems: builder.query<MenuItemDto[], void>({
      query: () => menuItemsBaseUrl,
      providesTags: ["menuitems"],
    }),

    getMenuItemById: builder.query<MenuItemDto, number>({
      query: (id) => `${menuItemsBaseUrl}/${id}`,
      providesTags: (result, error, id) => [{ type: "menuitems", id }],
    }),

    getMenuItemsByBakeryId: builder.query<MenuItemDto[], number>({
      query: (id) => `${menuItemsBaseUrl}/bakery/${id}`,
      providesTags: (result, error, id) => [{ type: "menuitems", id }],
    }),

    getMenuItemsByCakeId: builder.query<MenuItemDto[], number>({
      query: (id) => `${menuItemsBaseUrl}/cake/${id}`,
      providesTags: (result, error, id) => [{ type: "menuitems", id }],
    }),

    createMenuItem: builder.mutation<MenuItemDto, MenuItemDto>({
      query: (menuItem) => ({
        url: menuItemsBaseUrl,
        method: "POST",
        body: menuItem,
      }),
      invalidatesTags: ["menuitems"],
    }),

    deleteMenuItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `${menuItemsBaseUrl}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "menuitems" }],
    }),

    updateMenuItem: builder.mutation<
      MenuItemDto,
      { id: number; data: MenuItemDto }
    >({
      query: ({ id, data }) => ({
        url: `${menuItemsBaseUrl}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "menuitems", id },
        "menuitems",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetMenuItemByIdQuery,
  useGetMenuItemsByBakeryIdQuery,
  useGetMenuItemsByCakeIdQuery,
  useGetMenuItemsQuery,
  useUpdateMenuItemMutation,
} = menuItemQueryApi;
