/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouteContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouteContext = createContext<RouteContextType>({
  path: '/',
  navigate: () => {},
  params: {}
});

function getCleanPath(): string {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname || '/';
  return pathname;
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState<string>(getCleanPath);

  useEffect(() => {
    const handlePopState = () => {
      setPath(getCleanPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;
    if (to === window.location.pathname) return;

    window.history.pushState(null, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Compute matched params dynamically based on route patterns
  let params: Record<string, string> = {};

  // Pattern match: /jobs/:id
  const jobMatch = path.match(/^\/jobs\/([^/]+)$/);
  if (jobMatch) {
    params = { id: jobMatch[1] };
  }

  // Pattern match: /dashboard/jobs/:id (excluding 'new')
  const dashboardJobMatch = path.match(/^\/dashboard\/jobs\/([^/]+)$/);
  if (dashboardJobMatch && dashboardJobMatch[1] !== 'new') {
    params = { id: dashboardJobMatch[1] };
  }

  // Pattern match: /dashboard/applications/:id
  const appMatch = path.match(/^\/dashboard\/applications\/([^/]+)$/);
  if (appMatch) {
    params = { id: appMatch[1] };
  }

  return (
    <RouteContext.Provider value={{ path, navigate, params }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouteContext);
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ href, children, className = '', onClick, ...props }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);

    // Support standard modifier clicks (Cmd/Ctrl + click opens in new tab)
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
