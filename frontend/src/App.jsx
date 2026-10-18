import AppRoutes from "./routes/AppRoutes";
import BarangayThemeProvider from "./theme/BarangayThemeProvider";

function App() {
  return <BarangayThemeProvider><AppRoutes /></BarangayThemeProvider>;
}

export default App;
