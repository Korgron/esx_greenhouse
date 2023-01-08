import Greenhouse from "../classes/Greenhouse"
import GreenhouseData from "../classes/GreenhouseData";
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

    static async isOwnerOfGreenhouse(playerId, greenhouseId) {
        var greenhouseData = await oxmysql.query("SELECT * FROM pxl_greenhouse_owner WHERE f_pgh_id = ? AND f_identifier = ?", [greenhouseId, playerId])
        if (greenhouseData.length > 0) {return true}
        return false
    }

    static async addOwnerToGreenhouse(playerId, greenhouseId) {
        await oxmysql.prepare("INSERT INTO pxl_greenhouse_owner SET f_identifier = ?, f_pgh_id = ?", [playerId, greenhouseId])
    }

    static async GenerateGreenhouseZones(playerId, greenhouseId) {
        var house = await GreenhouseManager.getGreenhouseById(greenhouseId)
        for (let i = 0; i < house.zones; i++) {
            let name = `slot${i}`
            let label = `Stellpatz #${i}`
            await oxmysql.prepare("INSERT INTO pxl_greenhouse_plants_zones SET pgh_z_name = ?, pgh_z_label = ?, f_pgh_id = ?, f_identifier = ?", [name, label, greenhouseId, playerId])
        }
    }

    static async GetDataOfGreenhouse(playerId, greenhouseId) {
        var data = new GreenhouseData(greenhouseId)

        data.cargo = await oxmysql.prepare("SELECT * FROM pxl_greenhouse_cargo LEFT JOIN pxl_greenhouse_cargo_types ON pxl_greenhouse_cargo.f_pgh_ct_id = pxl_greenhouse_cargo_types.pgh_ct_id LEFT JOIN pxl_greenhouse_plants ON pxl_greenhouse_cargo.f_pgh_p_id = pxl_greenhouse_plants.pgh_p_id WHERE pxl_greenhouse_cargo.f_identifier = ? AND pxl_greenhouse_cargo.f_pgh_id = ?", [playerId, greenhouseId])
        data.plants = await oxmysql.prepare("SELECT * FROM pxl_greenhouse_plants WHERE pxl_greenhouse_plants.f_pgh_id = ?", [greenhouseId])
        data.zones = await oxmysql.prepare("SELECT * FROM pxl_greenhouse_plants_zones LEFT JOIN pxl_greenhouse_plants ON pxl_greenhouse_plants_zones.f_pgh_p_id = pxl_greenhouse_plants.pgh_p_id LEFT JOIN pxl_greenhouse_plants_stages ON pxl_greenhouse_plants_zones.f_pgh_ps_id = pxl_greenhouse_plants_stages.pgh_ps_id WHERE pxl_greenhouse_plants_zones.f_identifier = ? AND pxl_greenhouse_plants_zones.f_pgh_id = ?", [playerId, greenhouseId])
        data.owner = await oxmysql.prepare("SELECT * FROM pxl_greenhouse_owner LEFT JOIN users ON pxl_greenhouse_owner.f_identifier = users.identifier WHERE pxl_greenhouse_owner.f_pgh_id = ?", [greenhouseId])
        
    

        if (data.cargo != undefined && data.cargo.length == undefined) {data.cargo = [data.cargo]}
        if (data.plants != undefined && data.plants.length == undefined) {data.plants = [data.plants]}
        if (data.zones != undefined && data.zones.length == undefined) {data.zones = [data.zones]}
        if (data.owner != undefined && data.owner.length == undefined) {data.owner = [data.owner]}

        if (data.cargo == undefined) {data.cargo = []}
        if (data.plants == undefined) {data.plants = []}
        if (data.zones == undefined) {data.zones = []}
        if (data.owner == undefined) {data.owner = []}

        return data;
    }


    static async GetCargoOfGreenhouse(playerId, greenhouseId) {
        var cargo = await oxmysql.prepare("SELECT * FROM pxl_greenhouse_cargo LEFT JOIN pxl_greenhouse_cargo_types ON pxl_greenhouse_cargo.f_pgh_ct_id = pxl_greenhouse_cargo_types.pgh_ct_id LEFT JOIN pxl_greenhouse_plants ON pxl_greenhouse_cargo.f_pgh_p_id = pxl_greenhouse_plants.pgh_p_id WHERE pxl_greenhouse_cargo.f_identifier = ? AND pxl_greenhouse_cargo.f_pgh_id = ?", [playerId, greenhouseId])
        if (cargo != undefined && cargo.length == undefined) {cargo = [cargo]}
        if (cargo == undefined) {cargo = []}
        return cargo
    }

    static async GetPlantsOfGreenhouse(playerId, greenhouseId) {
        var plants = await oxmysql.prepare("SELECT * FROM pxl_greenhouse_plants WHERE pxl_greenhouse_plants.f_pgh_id = ?", [greenhouseId])
        if (plants != undefined && plants.length == undefined) {plants = [plants]}
        if (plants == undefined) {plants = []}
        return plants
    }

    static async GetZonesOfGreenhouse(playerId, greenhouseId) {
        var zones = await oxmysql.prepare("SELECT * FROM pxl_greenhouse_plants_zones LEFT JOIN pxl_greenhouse_plants ON pxl_greenhouse_plants_zones.f_pgh_p_id = pxl_greenhouse_plants.pgh_p_id LEFT JOIN pxl_greenhouse_plants_stages ON pxl_greenhouse_plants_zones.f_pgh_ps_id = pxl_greenhouse_plants_stages.pgh_ps_id WHERE pxl_greenhouse_plants_zones.f_identifier = ? AND pxl_greenhouse_plants_zones.f_pgh_id = ?", [playerId, greenhouseId])
        if (zones != undefined && zones.length == undefined) {zones = [zones]}
        if (zones == undefined) {zones = []}
        return zones
    }

    static async GetOwnerOfGreenhouse(greenhouseId) {
        var owner = await oxmysql.prepare("SELECT * FROM pxl_greenhouse_owner LEFT JOIN users ON pxl_greenhouse_owner.f_identifier = users.identifier WHERE pxl_greenhouse_owner.f_pgh_id = ?", [greenhouseId])
        if (owner != undefined && owner.length == undefined) {owner = [owner]}
        if (owner == undefined) {owner = []}
        return owner
    }
}