// main.tsx (or main.jsx if you're using JS)
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';

const PUBLISHABLE_KEY = "pk_test_Z29yZ2VvdXMtc2FpbGZpc2gtNi5jbGVyay5hY2NvdW50cy5kZXYk";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
    </ClerkProvider>
  </React.StrictMode>
);
