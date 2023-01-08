export default class GreenhouseData {
    id: number;
    cargo: Array<any>;
    plants: Array<any>;
    zones: Array<any>;
    owner: Array<any>;

    constructor(id: number) {
        this.id = id;
    }
}