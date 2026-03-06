'use client';

/**
 * Extended filter tile: uses the Compose SDK FilterTile when possible, with static data only (no fetch).
 * Converts JAQL to SDK Filter, wraps in a context that provides members from the filter props,
 * and renders the real CSDK FilterTile so you get all filter types (member, date range, relative date,
 * criteria, cascading, etc.) without requiring a Sisense server.
 */

import { useMemo } from 'react';
import { FilterTile as CsdkFilterTile } from '@sisense/sdk-ui';
import type { Filter } from '@sisense/sdk-data';
import { StaticFilterContextProvider } from '@/app/StaticFilterContext';
import { jaqlStateToSdkFilter, sdkFilterToJaqlState } from '@/app/sisenseFilterUtils';
import { FilterTile as LocalFilterTile } from '@/app/FilterTile';
import type { JaqlFilterState } from '@/app/types';

export interface SdkFilterTileProps {
  filter: JaqlFilterState;
  onChange: (filter: JaqlFilterState) => void;
  /**
   * When true (default), use the Compose SDK FilterTile — includes the SDK’s filter editor
   * (open via edit on the tile). When false, use the local tile with inline typing.
   */
  useSdkTile?: boolean;
}

/**
 * Renders a filter using the Compose SDK FilterTile. The SDK tile includes an edit action
 * that opens the SDK filter editor (type values there). Data comes from filter props only (no server fetch).
 */
export function SdkFilterTile({ filter, onChange, useSdkTile = true }: SdkFilterTileProps) {
  const sdkFilter = useMemo(() => jaqlStateToSdkFilter(filter), [filter]);

  const handleSdkChange = (updated: Filter | null) => {
    if (updated) {
      onChange(sdkFilterToJaqlState(updated, filter));
    }
  };

  // Cascading: SDK expects a single Filter; we keep using local tile for now
  if (filter.isCascading && filter.levels?.length) {
    return (
      <LocalFilterTile
        filter={filter}
        onChange={onChange}
      />
    );
  }

  // Not convertible to SDK Filter
  if (!sdkFilter) {
    return (
      <LocalFilterTile
        filter={filter}
        onChange={onChange}
      />
    );
  }

  // Use CSDK FilterTile with static context (no fetch)
  if (useSdkTile) {
    return (
      <StaticFilterContextProvider filter={sdkFilter}>
        <CsdkFilterTile
          filter={sdkFilter}
          onChange={handleSdkChange}
        />
      </StaticFilterContextProvider>
    );
  }

  return (
    <LocalFilterTile
      filter={filter}
      onChange={onChange}
    />
  );
}
