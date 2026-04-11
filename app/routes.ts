import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("signup/*", "routes/signup.tsx"),
  route("signin/*", "routes/signin.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("practice/:videoId", "routes/practice.tsx"),
] satisfies RouteConfig
