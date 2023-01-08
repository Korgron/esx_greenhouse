import Vector from "../classes/Vector";

export default interface Greenhouse {
    id: number;
    price: number;
    name: string;
    label: string;
    coords: Vector;
    entry: Vector;
    maxCargo: number;
    exit: Vector;
    zones: number;
    data: any;
}