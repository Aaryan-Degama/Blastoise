import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import SearchPage from "./pages/SearchPage";
import MediaDetail from "./pages/MediaDetail";
import { StrictMode } from "react";


const router = createBrowserRouter([{
    path:"/",
    element: <App />,
    children: [
        {path:'' , element: <Home />},
        { path:'media/:mediaID', element: <MediaDetail />},
        { path: 'collection', element: <Collection /> },
        { path: "search", element: <SearchPage /> }
    ]
}])


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);