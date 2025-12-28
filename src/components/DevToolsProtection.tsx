"use client";

import { useEffect } from "react";

export default function DevToolsProtection() {
  useEffect(() => {
    // 🔒 SECURITY PRO MAX - Comprehensive DevTools Protection

    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 2. Disable Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }
      
      // Cmd+Option+I (Mac DevTools)
      if (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        return false;
      }
      
      // Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        return false;
      }
      
      // Cmd+Option+C (Mac Inspect)
      if (e.metaKey && e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        return false;
      }
      
      // Cmd+U (Mac View Source)
      if (e.metaKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
    };

    // // 3. Disable Text Selection
    // const disableSelect = (e: Event) => {
    //   e.preventDefault();
    //   return false;
    // };

    // // 4. Disable Copy
    // const disableCopy = (e: ClipboardEvent) => {
    //   e.preventDefault();
    //   return false;
    // };

    // 5. Disable Cut
    const disableCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // 6. Disable Paste (optional, can be removed if needed)
    const disablePaste = (e: ClipboardEvent) => {
      // Only disable on non-input elements
      const target = e.target as HTMLElement;
      if (!target.matches('input, textarea, [contenteditable="true"]')) {
        e.preventDefault();
        return false;
      }
    };

    // 7. Detect DevTools Opening (Enhanced for browsers with sidebars)
    let isDevToolsWarningShown = false;
    const detectDevTools = () => {
      // Skip if warning already shown
      if (isDevToolsWarningShown) return;
      
      // More accurate detection - check both dimensions
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      // Higher threshold to avoid false positives with browser sidebars (Vivaldi, Opera, etc.)
      // Also check if BOTH dimensions are suspicious (more reliable)
      const threshold = 250;
      const isHeightSuspicious = heightDiff > threshold;
      const isWidthVeryLarge = widthDiff > 400; // Very large = definitely DevTools
      
      // Only trigger if height is suspicious OR width is extremely large
      // This avoids false positives from browser sidebars (usually only affect width by 200-300px)
      if (isHeightSuspicious || isWidthVeryLarge) {
        isDevToolsWarningShown = true;
        // Redirect to warning page or block content
        document.body.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            text-align: center;
            padding: 20px;
          ">
            <div style="
              background: rgba(0, 0, 0, 0.3);
              backdrop-filter: blur(10px);
              padding: 40px;
              border-radius: 20px;
              max-width: 600px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
              <div style="font-size: 80px; margin-bottom: 20px;">🔒</div>
              <h1 style="font-size: 32px; margin-bottom: 20px; font-weight: 700;">Access Denied</h1>
              <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">
                Developer tools are not allowed on this platform.
                <br/>Please close DevTools and refresh the page to continue.
              </p>
              <button 
                onclick="window.location.reload()" 
                style="
                  background: #fff;
                  color: #667eea;
                  border: none;
                  padding: 15px 40px;
                  font-size: 16px;
                  font-weight: 600;
                  border-radius: 10px;
                  cursor: pointer;
                  transition: transform 0.2s;
                "
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'"
              >
                Refresh Page
              </button>
            </div>
          </div>
        `;
      }
    };

    // 8. Advanced DevTools Detection using debugger
    const debuggerLoop = () => {
      const start = new Date().getTime();
      // eslint-disable-next-line no-debugger
      debugger; // This will cause a delay if DevTools is open
      const end = new Date().getTime();
      
      if (end - start > 100) {
        // DevTools is open
        document.body.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            text-align: center;
            padding: 20px;
          ">
            <div style="
              background: rgba(0, 0, 0, 0.3);
              backdrop-filter: blur(10px);
              padding: 40px;
              border-radius: 20px;
              max-width: 600px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
              <div style="font-size: 80px; margin-bottom: 20px;">⚠️</div>
              <h1 style="font-size: 32px; margin-bottom: 20px; font-weight: 700;">Security Alert</h1>
              <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">
                Unauthorized debugging detected!
                <br/>Close all developer tools immediately.
              </p>
            </div>
          </div>
        `;
      }
    };

    // 9. Disable Console Methods
    if (typeof window !== 'undefined') {
      const noop = () => {};
      const consoleProxy = new Proxy(console, {
        get() {
          return noop;
        }
      });
      
      try {
        Object.defineProperty(window, 'console', {
          get: () => consoleProxy,
          set: () => {}
        });
      } catch {
        // Fallback if property is not configurable
        ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'clear', 'count', 'countReset', 'assert', 'profile', 'profileEnd', 'time', 'timeLog', 'timeEnd', 'timeStamp'].forEach((method) => {
          (console as unknown as Record<string, unknown>)[method] = noop;
        });
      }
    }

    // 10. Prevent iframe injection
    const preventIframe = () => {
      if (window.self !== window.top) {
        window.top!.location.href = window.self.location.href;
      }
    };

    // 11. Clear localStorage/sessionStorage on suspicious activity
    const clearStorage = () => {
      try {
        // Only clear if DevTools detected (enhanced detection)
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        const devToolsOpen = heightDiff > 250 || widthDiff > 400;
        
        if (devToolsOpen) {
          sessionStorage.clear();
        }
      } catch {
        // Ignore
      }
    };

    // 12. Disable drag and drop
    const disableDragDrop = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 13. Monitor window resize (DevTools opening)
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(detectDevTools, 500);
    };

    // 14. Prevent source code viewing through protocol
    const preventSourceView = () => {
      if (window.location.protocol === 'view-source:') {
        window.location.href = window.location.href.replace('view-source:', '');
      }
    };

    // Apply CSS to prevent text selection
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      body {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
      }
    `;
    document.head.appendChild(style);

    // Register all event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    // document.addEventListener('selectstart', disableSelect);
    // document.addEventListener('copy', disableCopy);
    document.addEventListener('cut', disableCut);
    document.addEventListener('paste', disablePaste);
    document.addEventListener('dragstart', disableDragDrop);
    document.addEventListener('drop', disableDragDrop);
    window.addEventListener('resize', handleResize);

    // Start detection intervals
    const devToolsInterval = setInterval(detectDevTools, 1000);
    const debuggerInterval = setInterval(debuggerLoop, 1000);
    const storageInterval = setInterval(clearStorage, 2000);
    
    // Run initial checks
    preventIframe();
    preventSourceView();
    detectDevTools();

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      // document.removeEventListener('selectstart', disableSelect);
      // document.removeEventListener('copy', disableCopy);
      document.removeEventListener('cut', disableCut);
      document.removeEventListener('paste', disablePaste);
      document.removeEventListener('dragstart', disableDragDrop);
      document.removeEventListener('drop', disableDragDrop);
      window.removeEventListener('resize', handleResize);
      
      clearInterval(devToolsInterval);
      clearInterval(debuggerInterval);
      clearInterval(storageInterval);
      clearTimeout(resizeTimeout);
      
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return null;
}

