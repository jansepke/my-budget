const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @type {import('next').NextConfig} */
module.exports = (phase, { defaultConfig }) => ({
  reactStrictMode: true,
  async headers() {
    return phase === PHASE_DEVELOPMENT_SERVER
      ? []
      : [
          {
            source: "/(.*?)",
            headers: [
              {
                key: "Strict-Transport-Security",
                value: "max-age=63072000; includeSubDomains; preload",
              },
              {
                key: "X-Frame-Options",
                value: "SAMEORIGIN",
              },
              {
                key: "X-Content-Type-Options",
                value: "nosniff",
              },
              {
                key: "Referrer-Policy",
                value: "strict-origin-when-cross-origin",
              },
              {
                key: "Content-Security-Policy",
                value: "default-src 'self'; style-src 'self' 'unsafe-inline';",
              },
            ],
          },
        ];
  },
});
