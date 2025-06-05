import Inter from "../public/static/fonts/Inter.ttf";
import { ThemeProvider, CssBaseline, createTheme, Box } from "@mui/material";
import RootComponent from "./components/RootComponent";
import RootPage from "./components/RootPage";
import DataTable from "./test/DataTable";
import Hello from "./test/Hello";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
// import "../app.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./components/bodyComponents/home/Home";
import Inventory from "./components/bodyComponents/inventory/Inventory";
import Customer from "./components/bodyComponents/customer/Customer";
import Revenue from "./components/bodyComponents/revenue/Revenue";
import Growth from "./components/bodyComponents/growth/Growth";
import Setting from "./components/bodyComponents/Settings/Setting";
import Order from "./components/bodyComponents/order/Order";
import OrderModal from "./components/bodyComponents/order/OrderModal";
import { createContext, useState } from "react";

// Create theme context
export const ThemeContext = createContext();
// Create auth context
export const AuthContext = createContext();

const themeOptions = {
  "Blue Theme": {
    palette: {
      primary: {
        main: "#1976d2",
        light: "#90caf9",
      },
      secondary: {
        main: "#90caf9",
      },
    },
  },
  "Green Theme": {
    palette: {
      primary: {
        main: "#2e7d32",
        light: "#81c784",
      },
      secondary: {
        main: "#81c784",
      },
    },
  },
  "Orange Theme": {
    palette: {
      primary: {
        main: "#ed6c02",
        light: "#ffb74d",
      },
      secondary: {
        main: "#ffb74d",
      },
    },
  },
};

function App() {
  const [currentTheme, setCurrentTheme] = useState("Blue Theme");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const theme = createTheme({
    ...themeOptions[currentTheme],
    typography: {
      fontFamily: "Inter",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Raleway'), local('Raleway-Regular'), url(${Inter}) format('woff2');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
  });

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RootComponent />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/settings" element={<Setting />} />
        </Route>
      </>
    )
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
          <CssBaseline />
        </ThemeProvider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
