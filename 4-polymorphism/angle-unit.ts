export interface AngleUnit {
  toggle(): AngleUnit;
  getLabel(): string;
}

export class RadAngleUnit implements AngleUnit {
  toggle() {
    return new DegAngleUnit();
  }

  getLabel(): string {
    return "RAD";
  }
}

export class DegAngleUnit implements AngleUnit {
  toggle(): AngleUnit {
    return new RadAngleUnit();
  }

  getLabel(): string {
    return "DEG";
  }
}
