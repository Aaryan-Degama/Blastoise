import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import Home from "./pages/Home";
import MediaDetail from "./pages/MediaDetail";
import TierList from "./pages/TierList"; 
import { StrictMode } from "react";

const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        { path: '', element: <Home /> },
        { path: 'media/:mediaID', element: <MediaDetail /> },
        { path: 'tierlist', element: <TierList /> }, // 👈 add this
    ]
}])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);