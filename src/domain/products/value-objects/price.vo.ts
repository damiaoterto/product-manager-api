import { VoInvalidValue } from '@shared/exception/vo-invalid-value.exception';
import { ValueObject } from '@shared/interfaces/value-object.interface';

export class PriceValueObject implements ValueObject<number> {
  public readonly value: number;

  constructor(value: number) {
    this.validate(value);
    this.value = value;
  }

  validate(value: number): void {
    if (Number.isNaN(value)) {
      throw new VoInvalidValue(PriceValueObject.name);
    }
  }
}
