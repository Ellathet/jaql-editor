import { FilterItem, JaqlFilterState } from './types';

export function parseJaqlJson(jsonString: string): FilterItem[] {
  try {
    const parsed = JSON.parse(jsonString);
    // Ensure it's always an array
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    throw new Error('Invalid JSON format');
  }
}

export function validateJaqlStructure(items: FilterItem[]): boolean {
  return items.every(item => {
    const hasInstanceid = typeof item.instanceid === 'string';
    const hasJaqlOrCascading = item.jaql || item.isCascading;
    return hasInstanceid && hasJaqlOrCascading;
  });
}

export function updateFilterValue(
  filter: JaqlFilterState,
  fieldPath: string,
  value: unknown
): JaqlFilterState {
  const updated = { ...filter };
  const paths = fieldPath.split('.');
  
  let current: Record<string, unknown> = updated;
  for (let i = 0; i < paths.length - 1; i++) {
    const key = paths[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  
  const lastKey = paths[paths.length - 1];
  current[lastKey] = value;
  
  return updated;
}

export function exportToJson(filters: FilterItem[]): string {
  return JSON.stringify(filters, null, 2);
}

export function getFilterTitle(filter: FilterItem): string {
  if (filter.jaql?.title) {
    return filter.jaql.title;
  }
  if (filter.jaql?.column) {
    return filter.jaql.column;
  }
  if (filter.levels?.[0]?.title) {
    return filter.levels[0].title;
  }
  return `Filter ${filter.instanceid}`;
}
