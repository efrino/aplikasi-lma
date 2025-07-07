// src/lib/axios.ts
import axios from 'axios'

// ❌ Hapus withCredentials: true karena tidak pakai cookie
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999/api',
    // withCredentials: true, ❌ Hapus baris ini
})
