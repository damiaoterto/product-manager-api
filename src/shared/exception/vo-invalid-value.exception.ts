export class VoInvalidValue extends Error {
  constructor(voName: string) {
    super(`Invalid value for ${voName}`);
    this.name = VoInvalidValue.name;
  }
}
