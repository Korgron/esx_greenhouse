import Greenhouse from "../classes/Greenhouse"
import { oxmysql } from '@overextended/oxmysql';

export default class GreenhouseManager {
    private static getDefaultGreenhouse() {
        return new Greenhouse(0, 0, "default", "default", {}, 0, {}, {}, 0)
    }
    
    static async getGreenhouseById(_id: number) {
        var greenhouseData = await oxmysql.query("SELECT * FROM pxl_greenhouse WHERE pgh_id = ?", [_id])
        if (greenhouseData.length == 0) {return this.getDefaultGreenhouse()}

        var greenData = greenhouseData[0]
        var greenhouse = new Greenhouse(greenData.pgh_id, greenData.price, greenData.name, greenData.label, JSON.parse(greenData.coords), greenData.maxCargo, JSON.parse(greenData.entry), JSON.parse(greenData.exit), greenData.zones)

        return greenhouse
    }

    static async getGreenhouseByName(_name: String) {
        var greenhouseData = await oxmysql.query("SELECT * FROM pxl_greenhouse WHERE name = ?", [_name])
        if (greenhouseData.length == 0) {return this.getDefaultGreenhouse()}

        var greenData = greenhouseData[0]
        var greenhouse = new Greenhouse(greenData.pgh_id, greenData.price, greenData.name, greenData.label, JSON.parse(greenData.coords), greenData.maxCargo, JSON.parse(greenData.entry), JSON.parse(greenData.exit), greenData.zones)

        return greenhouse
    }


    static async getAllGreenhouses() {
        var greenhouseData = await oxmysql.query("SELECT * FROM pxl_greenhouse")
        var greenhouses = new Array<Greenhouse>

        for (const key in greenhouseData) {
            const greenData = greenhouseData[key];
            var greenhous = new Greenhouse(greenData.pgh_id, greenData.price, greenData.name, greenData.label, JSON.parse(greenData.coords), greenData.maxCargo, JSON.parse(greenData.entry), JSON.parse(greenData.exit), greenData.zones)
            greenhouses.push(greenhous)
        }

        return greenhouses
    }
}