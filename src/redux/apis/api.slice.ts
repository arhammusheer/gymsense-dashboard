// api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../const";
import { RootState } from "../store"; // Import your store's root state

// Optional fields are only available when authorized
export interface Iot {
  id: string;
  key?: string;
  occupancy: boolean;
  isOffline: boolean;
  batteryLevel?: number;
  name?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  timeline?: {
    from: string;
    to: string;
    occupancy: boolean;
  }[];
}

const ENABLE_STATE_TIMELINE = true;

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Iots"],
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token; // Adjust based on your auth state structure
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getIots: builder.query<Iot[], void>({
      query: () => "/iot",
      transformResponse: (response: { status: boolean; data: Iot[] }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Iots" as const, id }))]
          : [{ type: "Iots", id: "LIST" }],
    }),

    getIot: builder.query<Iot, string>({
      query: (id) => `/iot/${id}?getTimeline=${ENABLE_STATE_TIMELINE}`,
      transformResponse: (response: { status: boolean; data: Iot }) =>
        response.data,
      providesTags: (_result, _error, id) => [{ type: "Iots", id }],
    }),
    updateIot: builder.mutation<Iot, Partial<Iot> & Pick<Iot, "id">>({
      query: ({ id, ...data }) => ({
        url: `/iot/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Iots", id }],
      onQueryStarted: async ({ id, ...data }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getIot", id, (draft) => {
            // Update the draft with the new data
            Object.assign(draft, data);
          })
        );
        try {
          await queryFulfilled; // Wait for the mutation to complete successfully
          // You can perform any action after the query is fulfilled without returning a value
        } catch (error) {
          // Undo the optimistic update on error
          dispatch(patchResult.undo);
          // Optionally, throw the error to handle it in the calling code
          throw error;
        }
        // Make sure not to return anything
      },
    }),
    createIot: builder.mutation<Iot, void>({
      query: () => ({
        url: "/iot/create",
        method: "POST",
      }),
      transformResponse: (response: { iot: Iot }) => response.iot,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getIots", undefined, (draft) => {
            // Add the new item to the list
            draft.push({ id: "temp", occupancy: false, isOffline: false });
          })
        );
        try {
          await queryFulfilled; // Wait for the mutation to complete successfully
          // You can perform any action after the query is fulfilled without returning a value
        } catch (error) {
          // Undo the optimistic update on error
          dispatch(patchResult.undo);
          // Optionally, throw the error to handle it in the calling code
          throw error;
        }
        // Make sure not to return anything
      },
    }),
    deleteIot: builder.mutation<void, string>({
      query: (id) => ({
        url: `/iot/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getIots", undefined, (draft) => {
            // Remove the item from the list
            draft.splice(
              draft.findIndex((item) => item.id === id),
              1
            );
          })
        );
        try {
          await queryFulfilled; // Wait for the mutation to complete successfully
          // You can perform any action after the query is fulfilled without returning a value
        } catch (error) {
          // Undo the optimistic update on error
          dispatch(patchResult.undo);
          // Optionally, throw the error to handle it in the calling code
          throw error;
        }
        // Make sure not to return anything
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetIotsQuery } = apiSlice;

export const iot = {
  getIots: apiSlice.useGetIotsQuery,
  getIot: apiSlice.useGetIotQuery,
  updateIot: apiSlice.useUpdateIotMutation,
  createIot: apiSlice.useCreateIotMutation,
  deleteIot: apiSlice.useDeleteIotMutation,
};
