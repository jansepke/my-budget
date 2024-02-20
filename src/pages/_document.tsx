import { roboto } from "@/next/theme";
import { DocumentHeadTags, DocumentHeadTagsProps, documentGetInitialProps } from "@mui/material-nextjs/v14-pagesRouter";
import { DocumentProps, Head, Html, Main, NextScript } from "next/document";

// Workaround for initial icon flickering
const css = `
body {
  animation: fadeInAnimation ease 0.01s;
}

@keyframes fadeInAnimation {
  0% {
      opacity: 0;
  }
  100% {
      opacity: 1;
  }
}
`;

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
  return (
    <Html lang="en" className={roboto.className}>
      <Head>
        <DocumentHeadTags {...props} />
        <style>{css}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = documentGetInitialProps;
