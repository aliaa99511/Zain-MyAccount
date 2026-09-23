import { RouterProvider } from "react-router";
import "./App.css";
import router from "./routes";
import { ThemeProvider } from "./theme/ThemeProvider";
import { DialogProvider } from "./shared/dialog/DialogProvider";

function App() {
  return (
    <ThemeProvider>
      <DialogProvider>
        <RouterProvider router={router} />
      </DialogProvider>
    </ThemeProvider>
  );
}

export default App;
