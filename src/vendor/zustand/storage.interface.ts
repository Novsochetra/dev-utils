export interface StorageAdapter {
  get<T>(key: string): Promise<{ data: T; version: number } | null>;
  set<T>(key: string, value: { data: T; version: number }): Promise<void>;
}
