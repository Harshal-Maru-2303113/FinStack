import { usePathname } from 'next/navigation';

export function useIsCurrentPage(path: string): boolean {
  const pathname = usePathname();
  
  // Check if the current path starts with the given path
  // This allows for nested routes to be considered "current"
  return pathname?.startsWith(path) ?? false;
}

