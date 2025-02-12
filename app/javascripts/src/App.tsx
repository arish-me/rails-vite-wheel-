// Import React and hooks
import React from "react";

import { Provider } from "react-redux";
import store from "@/app/store";
import { ThemeProvider } from "@/lib/theme-provider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "@/routes/AppRoutes";

// Main App Component
const App = () => {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster richColors />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
