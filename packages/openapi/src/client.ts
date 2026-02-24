import createClient from "openapi-fetch"
import type { paths } from "./types"
export const apiClient = createClient<paths>({
  baseUrl: "https://tms-openapi-api.vercel.app",
})