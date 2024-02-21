import { CategoriesProvider } from "@/components/shared/CategoriesProvider";
import { Navigation } from "@/components/shared/Navigation";
import { PageProps } from "@/domain";
import theme from "@/next/theme";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";

export default function MyApp({ Component, pageProps: { session, categories, ...pageProps } }: AppProps<PageProps>) {
  const App = () => {
    const { data: session } = useSession();

    return session ? (
      <>
        <Box mb={6}>
          <Component {...pageProps} />
        </Box>
        <Navigation />
      </>
    ) : null;
  };

  return (
    <SessionProvider session={session}>
      <AppCacheProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <Head>
            <title>My Budget</title>
            <meta name="description" content="My Budget" />
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <CategoriesProvider categories={categories}>
              <App />
            </CategoriesProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </AppCacheProvider>
    </SessionProvider>
  );
}
