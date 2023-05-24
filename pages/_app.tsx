import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/ui/Layout";
import { AuthUserProvider } from "@/context/authContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthUserProvider >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthUserProvider>
  );
}
