/*
Script made by Korgi aka KorgiZockt aka Korgron
*/

import GreenhouseController from "./controller/GreenhouseController";

var ESX = null
emit("esx:getSharedObject", (obj) => ESX = obj);

//#region Greenhouse
ESX.RegisterServerCallback("esx_greenhouse?GetGreenhouses", async (src, cb) => {
    var greenhouses = await GreenhouseController.getAllGreenhouses()

    cb(greenhouses)
})

ESX.RegisterServerCallback("esx_greenhouse?GetDataOfGreenhouse", (src, cb) => {

})

ESX.RegisterServerCallback("esx_greenhouse?BuyGreenhouse", (src, cb) => {

})

ESX.RegisterServerCallback("esx_greenhouse?SellGreenhouse", (src, cb) => {

})
//#endregion


//#region Greenhouse Cargo
ESX.RegisterServerCallback("esx_greenhouse?SellCargo", (src, cb) => {

})
//#endregion


//#region Greenhouse Seeds/Plants
ESX.RegisterServerCallback("esx_greenhouse?BuySeeds", (src, cb) => {

})

ESX.RegisterServerCallback("esx_greenhouse?PlantSeed", (src, cb) => {

})

ESX.RegisterServerCallback("esx_greenhouse?DestroyPlant", (src, cb) => {

})

ESX.RegisterServerCallback("esx_greenhouse?HarvestPlant", (src, cb) => {

})
//#endregion


//#region Runtime
setInterval(async () => {

}, 60000)
//#endregion

async function getGreenhouse() {
    var Greenhouses = await GreenhouseController.getGreenhouseById(1)

    console.log('Server', Greenhouses.name);
}

getGreenhouse()