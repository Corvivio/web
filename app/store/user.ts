import { create } from "zustand"

interface UserStore {
  apiUrl: string
}

export const useUserStore = create<UserStore>(() => ({
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
}))
