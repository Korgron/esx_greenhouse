/*
Script made by Korgi aka KorgiZockt aka Korgron
*/

import { oxmysql } from "@overextended/oxmysql";
import GreenhouseController from "./controller/GreenhouseController";

var ESX = null
ESX = global.exports.es_extended.getSharedObject()

//#region Greenhouse
ESX.RegisterServerCallback("esx_greenhouse?GetGreenhouses", async (src, cb) => {
    var greenhouses = await GreenhouseController.getAllGreenhouses()

    cb(greenhouses)
})

ESX.RegisterServerCallback("esx_greenhouse?IsOwnerOfGreenhouse", async (src, cb, greenhouseId) => {
    var xPlayer = ESX.GetPlayerFromId(src)
    var isOwner = await GreenhouseController.isOwnerOfGreenhouse(xPlayer.getIdentifier(), greenhouseId)
    cb(isOwner)
})

ESX.RegisterServerCallback("esx_greenhouse?BuyGreenhouse", async (src, cb, greenhouseId) => {
    var xPlayer = ESX.GetPlayerFromId(src)
    var xHouse = await GreenhouseController.getGreenhouseById(greenhouseId)

    if (xPlayer.getMoney() >= xHouse.price) {
        xPlayer.removeMoney(xHouse.price)
        await GreenhouseController.addOwnerToGreenhouse(xPlayer.getIdentifier(), greenhouseId)
        await GreenhouseController.GenerateGreenhouseZones(xPlayer.getIdentifier(), greenhouseId)
        cb(true)
        return
    }
    cb(false)
})

ESX.RegisterServerCallback("esx_greenhouse?SellGreenhouse", async (src, cb, house) => {
    const xPlayer = ESX.GetPlayerFromId(src)
    xPlayer.addMoney(house.price)

    await oxmysql.prepare("DELETE FROM greenhouse_owner WHERE f_identifier = ? AND f_pgh_id = ?", [xPlayer.getIdentifier(), house.id])
    await oxmysql.prepare("DELETE FROM greenhouse_plants_zones WHERE f_identifier = ? AND f_pgh_id = ?", [xPlayer.getIdentifier(), house.id])
    await oxmysql.prepare("DELETE FROM greenhouse_cargo WHERE f_identifier = ? AND f_pgh_id = ?", [xPlayer.getIdentifier(), house.id])

    var l_extra = 0

    if (house.data.cargo.length != 0) {
        for (const i in house.data.cargo) {
            var ival = house.data.cargo[i]
            if (ival.pgh_ct_name == "seed") {continue}
            const weight = ival.pgh_c_amount * ival.pgh_p_weight
            const price = (weight/1000)*ival.pgh_p_sellprice
            l_extra += price
        }
    }

    if (l_extra > 0) {
        xPlayer.addMoney(l_extra)
    }
    cb(true, house.price, l_extra)
})

ESX.RegisterServerCallback("esx_greenhouse?GetDataOfGreenhouse", async (src, cb, greenhouseId) => {
    var xPlayer = ESX.GetPlayerFromId(src)
    var data = await GreenhouseController.GetDataOfGreenhouse(xPlayer.getIdentifier(), greenhouseId)
    cb(data)
})
//#endregion


//#region Greenhouse Cargo
ESX.RegisterServerCallback("esx_greenhouse?SellCargo", async (src, cb, object, house) => {
    var xPlayer = ESX.GetPlayerFromId(src)
    var cashout = Math.floor((object.value*object.data.pgh_p_weight/1000)*object.data.pgh_p_sellprice)
    var cargo = await GreenhouseController.GetCargoOfGreenhouse(xPlayer.getIdentifier(), house.id)

    for (const i in cargo) {
        let obj = cargo[i]
        if (obj.f_pgh_ct_id == 1 && obj.pgh_p_name == object.data.pgh_p_name) {
            let amount = obj.pgh_c_amount - object.value

            if (amount <= 0) {
                await oxmysql.prepare("DELETE FROM greenhouse_cargo WHERE pgh_c_id = ?", [obj.pgh_c_id])
                cashout = Math.floor((obj.pgh_c_amount*object.data.pgh_p_weight/1000)*object.data.pgh_p_sellprice)
            } else {
                await oxmysql.prepare("UPDATE greenhouse_cargo SET pgh_c_amount = ? WHERE pgh_c_id = ?", [amount, obj.pgh_c_id])
            }

            xPlayer.addMoney(cashout)
            cb(true, object.data.pgh_p_label, object.value*object.data.pgh_p_weight, cashout)
            return
        }
    }
    cb(false)
})
//#endregion


//#region Greenhouse Seeds/Plants
ESX.RegisterServerCallback("esx_greenhouse?BuySeeds", async (src, cb, object, house) => {
    var xPlayer = ESX.GetPlayerFromId(src)
    const weight = object.data.p_weight * object.value
    const price = object.data.pgh_p_price * object.value

    if (xPlayer.getMoney() < price) {cb(false);return}
    await oxmysql.prepare("INSERT INTO greenhouse_cargo SET pgh_c_amount = ?, f_pgh_p_id = ?, f_pgh_ct_id = ?, f_pgh_id = ?, f_identifier = ?", [object.value, object.data.pgh_p_id, 2, house.id, xPlayer.getIdentifier()])
    xPlayer.removeMoney(price)
    cb(true, object.data.pgh_p_label, weight, price)
})

ESX.RegisterServerCallback("esx_greenhouse?PlantSeed", async (src, cb, zone, house, data) => {

    await oxmysql.prepare("UPDATE greenhouse_plants_zones SET pgh_z_planted = CURRENT_TIMESTAMP(), pgh_z_last_growed = CURRENT_TIMESTAMP(), f_pgh_p_id = ?, f_pgh_ps_id = 1 WHERE pgh_z_id = ?", [data.pgh_p_id, zone.pgh_z_id])
    await oxmysql.prepare("UPDATE greenhouse_cargo SET pgh_c_amount = ? WHERE pgh_c_id = ?", [data.pgh_c_amount - 1, data.pgh_c_id])

    if ((data.pgh_c_amount-1) <= 0) {
        await oxmysql.prepare("DELETE FROM greenhouse_cargo WHERE pgh_c_id = ?", [data.pgh_c_id])
    }

    cb(true)
})

ESX.RegisterServerCallback("esx_greenhouse?DestroyPlant", async (src, cb, zone, house) => {
    await oxmysql.prepare("UPDATE greenhouse_plants_zones SET pgh_z_planted = (null), pgh_z_last_growed = (null), f_pgh_p_id = 0, f_pgh_ps_id = 0, pgh_z_amount = 0 WHERE pgh_z_id = ?", [zone.pgh_z_id])
    cb(true)
})

ESX.RegisterServerCallback("esx_greenhouse?HarvestPlant", async (src, cb, zone, house) => {
    var xPlayer = ESX.GetPlayerFromId(src)
    var cargo = await GreenhouseController.GetCargoOfGreenhouse(xPlayer.getIdentifier(), house.id)

    for (const i in cargo) {
        let obj = cargo[i]

        if (obj.f_pgh_ct_id == 1 && obj.pgh_p_name == zone.pgh_p_name) {
            var amount = obj.pgh_c_amount + zone.pgh_z_amount
            await oxmysql.prepare("UPDATE greenhouse_cargo SET pgh_c_amount = ? WHERE pgh_c_id = ?", [amount, obj.pgh_c_id])
            await oxmysql.prepare("UPDATE greenhouse_plants_zones SET pgh_z_planted = (null), pgh_z_last_growed = (null), f_pgh_p_id = 0, f_pgh_ps_id = 0, pgh_z_amount = 0 WHERE pgh_z_id = ?", [zone.pgh_z_id])
            cb(true)
            return
        }
    }
    
    await oxmysql.prepare("INSERT INTO greenhouse_cargo SET pgh_c_amount = ?, f_pgh_p_id = ?, f_pgh_ct_id = ?, f_pgh_id = ?, f_identifier = ?", [zone.pgh_z_amount, zone.pgh_p_id, 1, house.id, xPlayer.getIdentifier()])
    await oxmysql.prepare("UPDATE greenhouse_plants_zones SET pgh_z_planted = (null), pgh_z_last_growed = (null), f_pgh_p_id = 0, f_pgh_ps_id = 0, pgh_z_amount = 0 WHERE pgh_z_id = ?", [zone.pgh_z_id])

    cb(true)
})
//#endregion


//#region Runtime
setInterval(async () => {
    var zones = await oxmysql.query("SELECT * FROM greenhouse_plants_zones LEFT JOIN greenhouse_plants ON greenhouse_plants_zones.f_pgh_p_id = greenhouse_plants.pgh_p_id LEFT JOIN greenhouse ON greenhouse_plants_zones.f_pgh_id = greenhouse.pgh_id WHERE pgh_z_last_growed IS NOT NULL", [])

    if (zones != undefined && zones.length == undefined) {zones = [zones]}
    if (zones == undefined) {zones = []}
    

    for (const key in zones) {
        let obj = zones[key]

        const xPlayer = ESX.GetPlayerFromIdentifier(obj.f_identifier)
        const current = new Date()
        const t = obj.pgh_z_last_growed.split(/[- :]/)
        const date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
        const pMr = Math.abs(current.getTime() - date.getTime()) / 60000

        if (pMr >= 40 && obj.f_pgh_ps_id < 4) {
            var weight = Math.floor((obj.pgh_p_maxProduce/3)*(obj.f_pgh_ps_id))
            await oxmysql.prepare("UPDATE greenhouse_plants_zones SET pgh_z_amount = ?, pgh_z_last_growed = CURRENT_TIMESTAMP(), f_pgh_ps_id = ? WHERE pgh_z_id = ?", [weight, obj.f_pgh_ps_id+1, obj.pgh_z_id])
            obj.f_pgh_ps_id = obj.f_pgh_ps_id + 1

            if (obj.f_pgh_ps_id == 4 && xPlayer) {
                xPlayer.triggerEvent("esx_greenhouse!PlantHarvestable", obj.label, obj.pgh_z_label, obj.pgh_p_label, weight)
            }
        }
    }
}, 60000)
//#endregion