# Security policy

## Scope

Version 0.1.x is an early release. Security-focused engineering is not a security certification or penetration test. Keep the library, React, browsers, and host application patched.

## Trust boundaries

- React app definitions and icons are trusted executable application code. App windows share the page origin and privileges. The error boundary is a rendering fallback, not a sandbox.
- Text properties render through React escaping. There is no `dangerouslySetInnerHTML`, `eval`, HTML parser, remote script loader, or user-controlled URL navigation in the library.
- No network requests, local/session storage, cookies, analytics, or credentials are used by the library. The host is responsible for authorization, API security, validation, and user data.
- Never put secrets in frontend code. Never insert untrusted HTML into your app content. Isolate third-party applications on separate origins with an appropriately sandboxed iframe if needed; that integration is outside this release.
- Window and page-size caps mitigate accidental DOM growth, not denial of service from trusted app code. Render functions, input datasets, and the number of configured shortcuts remain host-controlled.

## Demo and deployment

The static demo uses a restrictive meta CSP: same-origin script files, no connections, no objects, no form submissions, and no base URL changes. Inline style permission is limited to styles because window geometry changes at runtime. No script `unsafe-inline` or `unsafe-eval` is required.

On hosts supporting response headers, set `Content-Security-Policy` (including `frame-ancestors 'none'` when embedding is not desired), `X-Content-Type-Options: nosniff`, and a suitable `Referrer-Policy`. `frame-ancestors` does not work in a meta tag. Do not copy the demo's `connect-src 'none'` into an application that legitimately needs APIs without defining your permitted origins.

GitHub workflow permissions are limited by job. CI tests pull requests without publication secrets. Deployment and publication are restricted to main/release events. Use npm trusted publishing and protect the main branch and release environment. Action tags should be maintained; pin actions to reviewed commit SHAs for stronger supply-chain controls.

## Reporting

Use GitHub's private vulnerability reporting on this repository if the owner has enabled it. Otherwise open a minimal issue requesting a private contact **without exploit details or sensitive data**. Do not post credentials, customer information, or detailed exploits publicly. No guaranteed response SLA is currently offered.
