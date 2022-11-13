export default class Greenhouse {
    id: number;
    price: number;
    name: String;
    label: String;
    coords: Object;
    entry: Object;
    maxCargo: number;
    exit: Object;
    zones: number;
    
    constructor(id: number, price: number, name: String, label: String, coords: Object, maxCargo: number, entry: Object, exit: Object, zones: number) {
        this.id = id
        this.price = price
        this.name = name
        this.label = label
        this.coords = coords
        this.maxCargo = maxCargo
        this.entry = entry
        this.exit = exit
        this.zones = zones
    }

}