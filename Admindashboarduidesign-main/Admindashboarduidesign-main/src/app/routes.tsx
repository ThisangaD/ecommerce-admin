import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { Users } from "./pages/Users";
import { Products } from "./pages/Products";
import { Categories } from "./pages/Categories";
import { Orders } from "./pages/Orders";
import { OrderDetails } from "./pages/OrderDetails";
import { Settings } from "./pages/Settings";
import { Layout } from "./components/Layout";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "dashboard", Component: AdminDashboard },
      { path: "user-dashboard", Component: UserDashboard },
      { path: "users", Component: Users },
      { path: "products", Component: Products },
      { path: "categories", Component: Categories },
      { path: "orders", Component: Orders },
      { path: "orders/:id", Component: OrderDetails },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);
