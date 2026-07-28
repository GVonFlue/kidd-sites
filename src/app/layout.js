// Fonts are self-hosted from npm rather than fetched from Google.
// Deliberate: no third-party request on first paint, no external dependency for
// the client to inherit, and the site renders identically offline.
import '@fontsource-variable/archivo';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';

export const metadata = { title: 'Kidd Sites', robots: { index: false, follow: false } };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Marks the document as JavaScript-capable BEFORE first paint. Scroll
            reveals hide themselves only inside this scope, so with JS disabled
            nothing can be left stuck at opacity 0. Inline and synchronous on
            purpose: deferring it would cause a flash of hidden content. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
