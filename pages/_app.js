import "antd/dist/antd.css";
import { AuthProvider } from "../hooks/useAuth";
import "./app.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
