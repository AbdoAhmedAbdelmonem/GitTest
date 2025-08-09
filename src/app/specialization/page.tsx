'use client';
// RedirectToRoot.tsx
import { useEffect } from 'react';

export default function Redirect() {
  useEffect(() => {
    window.location.href = '/';
  }, []);

  return null;
}
