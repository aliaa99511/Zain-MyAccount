import { RouterProvider } from "react-router";
import "./App.css";
import router from "./routes";
import { ThemeProvider } from "./theme/ThemeProvider";
import { DialogProvider } from "./shared/dialog/DialogProvider";
import { createContext, useState } from "react";

type Direction = 'ltr' | 'rtl';
type Language = 'Ar' | 'En';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function App() {
  const [language, setLanguage] = useState<Language>("En")
  const direction: Direction = language === "Ar" ? 'rtl' : 'ltr';
  // const version = __APP_VERSION__
  // console.log(version)

  return (
    <ThemeProvider direction={direction}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <DialogProvider>
          <RouterProvider router={router} />
        </DialogProvider>
      </LanguageContext.Provider>
    </ThemeProvider>
  );
}

export default App;
