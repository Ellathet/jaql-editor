'use client';

/**
 * Provides a minimal Sisense context so that CSDK FilterTile can render without a real server.
 * The mock app's query client returns static data from the filter (e.g. members from the Filter object)
 * so no network request is made.
 */

import React, { useMemo } from 'react';
import { CustomSisenseContextProvider } from '@sisense/sdk-ui';
import type { Filter } from '@sisense/sdk-data';
import { isMembersFilter } from '@sisense/sdk-data';

/** Build rows shape expected by SDK: rows[i] = [{ data: memberValue }] */
function getStaticRowsFromFilter(filter: Filter): unknown[][] {
  if (isMembersFilter(filter)) {
    const members = filter.members ?? [];
    return members.map((m) => [{ data: m }]);
  }
  return [];
}

/**
 * Creates a minimal ClientApplication-like object so that useGetFilterMembers (and similar)
 * get static data from the filter instead of calling the server.
 */
function createStaticFilterApp(filter: Filter): {
  queryClient: {
    executeQuery: (request: unknown) => {
      resultPromise: Promise<{ rows: unknown[][] }>;
      cancel: () => void;
    };
  };
  settings: {
    queryLimit: number;
    locale?: string;
    queryCacheConfig?: { enabled: boolean };
    serverThemeSettings?: unknown;
    translationConfig?: unknown;
  };
  httpClient: unknown;
  pivotQueryClient: unknown;
  defaultDataSource?: unknown;
  queryCache: { clear: () => void };
} {
  const rows = getStaticRowsFromFilter(filter);
  return {
    queryClient: {
      executeQuery: () => ({
        resultPromise: Promise.resolve({ rows }),
        cancel: () => {},
      }),
    },
    settings: {
      queryLimit: 20000,
      queryCacheConfig: { enabled: false },
      translationConfig: { language: 'en', customTranslations: undefined },
    },
    httpClient: {},
    pivotQueryClient: {},
    queryCache: { clear: () => {} },
  };
}

const staticContextBase = {
  isInitialized: true as const,
  tracking: { enabled: false, packageName: 'sdk-ui' },
  errorBoundary: { showErrorBox: false },
};

export interface StaticFilterContextProviderProps {
  filter: Filter;
  children: React.ReactNode;
}

/**
 * Wraps children in a Sisense context that uses static data from the given filter.
 * Use this so that CSDK FilterTile renders without requiring a Sisense server or fetch.
 */
export function StaticFilterContextProvider({ filter, children }: StaticFilterContextProviderProps) {
  const context = useMemo(
    () => ({
      ...staticContextBase,
      app: createStaticFilterApp(filter),
    }),
    [filter]
  );

  return (
    <CustomSisenseContextProvider context={context}>
      {children}
    </CustomSisenseContextProvider>
  );
}
