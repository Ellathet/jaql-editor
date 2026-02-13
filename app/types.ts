export interface Filter {
  explicit?: boolean;
  multiSelection?: boolean;
  all?: boolean;
  members?: string[];
}

export interface Datasource {
  address: string;
  title: string;
  id: string;
  database: string;
  fullname: string;
  live: boolean;
}

export interface Jaql {
  table: string;
  column: string;
  dim: string;
  datatype: string;
  merged?: boolean;
  datasource: Datasource;
  firstday?: string;
  locale?: string;
  title: string;
  collapsed?: boolean;
  isDashboardFilter?: boolean;
  columnTitle?: string;
  tableTitle?: string;
  filter: Filter;
}

export interface JaqlLevel {
  table: string;
  column: string;
  dim: string;
  datatype: string;
  merged?: boolean;
  datasource: Datasource;
  firstday?: string;
  locale?: string;
  title: string;
  collapsed?: boolean;
  isDashboardFilter?: boolean;
  panel?: string;
  instanceid?: string;
  filter: Filter;
}

export interface JaqlModel {
  instanceid: string;
  __store: string[];
}

export interface FilterItem {
  jaql?: Jaql;
  instanceid: string;
  isCascading: boolean;
  disabled: boolean;
  levels?: JaqlLevel[];
  model?: JaqlModel;
}

export interface JaqlFilterState extends FilterItem {
  tempValues?: Record<string, unknown>;
}
