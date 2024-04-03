// api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../const";
import { RootState } from "../store"; // Import your store's root state

// Optional fields are only available when authorized
export interface Iot {
  id: string;
  key?: string;
  occupancy: boolean;
  batteryLevel?: number;
  name?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
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
    }),

    getIot: builder.query<Iot, string>({
      query: (id) => `/iot/${id}`,
      transformResponse: (response: { status: boolean; data: Iot }) =>
        response.data,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetIotsQuery } = apiSlice;

export const iot = {
  getIots: apiSlice.useGetIotsQuery,
  getIot: apiSlice.useGetIotQuery,
};
