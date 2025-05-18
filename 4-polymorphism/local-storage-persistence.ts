import { z } from 'zod';

export class LocalStoragePersistence<Z extends z.ZodTypeAny> {
  private readonly storageKey: string;

  constructor(key: string, private readonly schema: Z, private readonly defaultState: z.output<Z>, version?: string) {
    this.storageKey = version ? `${key}_v${version}` : key;
  }

  public save(data: z.output<Z>): boolean {
    try {
      const serialized = JSON.stringify(this.schema.parse(data));
      localStorage.setItem(this.storageKey, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
      return false
    }
  }

  private load(): z.output<Z> {
    const serialized = localStorage.getItem(this.storageKey);

    if (!serialized) {
      return this.defaultState;
    }

    const parsed = JSON.parse(serialized);

    return this.schema.parse(parsed);
  }

  public safeLoad(): z.output<Z> | null {
    try {
      return this.load();
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      return null;
    }
  }

  public update(setter: (prevState: z.output<Z>) => z.output<Z>): boolean {
    try {
      const prevState = this.load();
      this.save(setter(prevState));
      return true;
    } catch (error) {
      console.error('Failed to update data in localStorage:', error);
      return false;
    }
  }

  public clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear data from localStorage:', error);
    }
  }
}
