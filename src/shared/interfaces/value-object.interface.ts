export interface ValueObject<V = string> {
  validate(value: V): void;
}
