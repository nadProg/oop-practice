type AngleUnitKey = "DEG" | "RAD";

export interface AngleUnit {
  getKey(): AngleUnitKey;
  toggle(): AngleUnit;
  getRadians(value: number): number;
  getLabel(): string;
  getFunctionIndex(): string;
}

export class RadAngleUnit implements AngleUnit {
  getKey(): AngleUnitKey {
    return "RAD";
  }

  toggle() {
    return new DegAngleUnit();
  }

  getRadians(value: number): number {
    return value;
  }

  getLabel(): string {
    return "RAD";
  }

  getFunctionIndex(): string {
    return "r";
  }
}

export class DegAngleUnit implements AngleUnit {
  getKey(): AngleUnitKey {
    return "DEG";
  }

  toggle(): AngleUnit {
    return new RadAngleUnit();
  }

  getRadians(value: number): number {
    return value * (Math.PI / 180);
  }

  getLabel(): string {
    return "DEG";
  }

  getFunctionIndex(): string {
    return "o";
  }
}

type SerializableAngleUnit = {
  key: AngleUnitKey;
};

export class AngleUnitFactory {
  private static readonly angleUnitRegistry: {
    [K in AngleUnitKey]: AngleUnit;
  } = {
    DEG: new DegAngleUnit(),
    RAD: new RadAngleUnit(),
  };

  static toSerializable(angleUnit: AngleUnit): SerializableAngleUnit {
    return {
      key: angleUnit.getKey(),
    };
  }

  static fromSerializable(serialized: SerializableAngleUnit): AngleUnit | null {
    return this.angleUnitRegistry[serialized.key] || null;
  }
}
