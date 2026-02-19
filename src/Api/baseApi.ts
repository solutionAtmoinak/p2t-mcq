import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const fetchBaseApi = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_APIBaseUrl,
    method: "POST",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) headers.set('Authorization', `Bearer ${token}`);
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: async (args, api, extraOptions) => {
        try {
            const result = await fetchBaseApi(args, api, extraOptions);
            return result;
        } catch (error: any) {
            if (error.status === 401) {
                localStorage.removeItem('token');
                window.location.replace('/auth/login');
            }
            throw error;
        }
    },
    tagTypes: ['p2tWebApi', 'Package'],
    endpoints: () => ({})
});

export default baseApi;