export abstract class BaseRepository<E = unknown> {
  abstract findAll(): Promise<E[]>;
  abstract findOneById(id: string): Promise<E | undefined>;
  abstract createNew(data: E): Promise<void>;
  abstract update(
    id: string,
    data: Omit<Partial<E>, 'createdAt' | 'updatedAt'>,
  ): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
