export interface UseCase<D = unknown, R = unknown> {
  execute(data: D): Promise<R>;
}
