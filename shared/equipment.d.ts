type EquipmentDescription = { equipment:string; name:string; isBodyweight?:boolean };
export function equipmentTags(exercise: EquipmentDescription): string[];
export function available(exercise: EquipmentDescription, equipment: string[]): boolean;
