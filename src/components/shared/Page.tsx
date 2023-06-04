import Head from "next/head";
import React from "react";

interface PageProps extends React.PropsWithChildren {
  headline: string;
}

const Page: React.FC<PageProps> = ({ headline, children }) => (
  <>
    <Head>
      <title>{headline}</title>
      <meta name="description" content="My Money" />
    </Head>

    {children}
  </>
);

export default Page;
