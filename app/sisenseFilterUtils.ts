/**
 * Converts between app JaqlFilterState and @sisense/sdk-data Filter for use with SDK FilterTile.
 */
import { createFilterFromJaql } from '@sisense/sdk-data';
import type { Filter } from '@sisense/sdk-data';
import type { JaqlFilterState } from '@/app/types';
import type { Jaql } from '@/app/types';

export type SdkFilterJaql = {
  dim: string;
  datatype: string;
  table?: string;
  column?: string;
  title?: string;
  datasource?: Jaql['datasource'];
  [key: string]: unknown;
} & {
  filter: {
    all?: boolean;
    members?: string[];
    multiSelection?: boolean;
    explicit?: boolean;
    exclude?: { members: string[] };
    [key: string]: unknown;
  };
};

function toSdkFilterJaql(jaql: Jaql): SdkFilterJaql {
  const f = jaql.filter;
  let filter: SdkFilterJaql['filter'];
  if (f.all) {
    filter = { all: true };
  } else if (f.explicit && Array.isArray(f.members)) {
    filter = {
      members: f.members,
      multiSelection: f.multiSelection ?? true,
    };
  } else {
    filter = { members: [], multiSelection: f.multiSelection ?? true };
  }
  return {
    dim: jaql.dim,
    datatype: jaql.datatype,
    table: jaql.table,
    column: jaql.column,
    title: jaql.title,
    datasource: jaql.datasource,
    filter,
  } as SdkFilterJaql;
}

export function jaqlStateToSdkFilter(state: JaqlFilterState): Filter | null {
  if (state.isCascading || !state.jaql) return null;
  try {
    const sdkJaql = toSdkFilterJaql(state.jaql);
    return createFilterFromJaql(
      sdkJaql as Parameters<typeof createFilterFromJaql>[0],
      state.instanceid,
      state.disabled,
      false
    );
  } catch {
    return null;
  }
}

export function sdkFilterToJaqlState(
  sdkFilter: Filter,
  previousState: JaqlFilterState
): JaqlFilterState {
  let jaqlPayload: { jaql?: Record<string, unknown> } = {};
  try {
    const raw = (sdkFilter as { jaql?(nested?: boolean): unknown }).jaql?.(true);
    if (raw && typeof raw === 'object') {
      jaqlPayload = { jaql: raw as Record<string, unknown> };
    }
  } catch {
    // keep previous jaql if conversion fails
  }

  const jaql = jaqlPayload.jaql as Jaql | undefined;
  if (!jaql) return previousState;

  const f = (jaql as { filter?: Record<string, unknown> }).filter;
  const filter = f
    ? {
        explicit: !('all' in f && f.all),
        all: !!(f as { all?: boolean }).all,
        members: Array.isArray((f as { members?: string[] }).members)
          ? (f as { members: string[] }).members
          : previousState.jaql?.filter?.members ?? [],
        multiSelection: (f as { multiSelection?: boolean }).multiSelection ?? true,
      }
    : previousState.jaql?.filter;

  return {
    ...previousState,
    disabled: (sdkFilter.config as { disabled?: boolean })?.disabled ?? previousState.disabled,
    jaql: {
      ...previousState.jaql,
      ...jaql,
      filter,
    } as Jaql,
  };
}
