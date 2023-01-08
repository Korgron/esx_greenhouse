import Greenhouse from "./interface/Greenhouse";
import Marker from "./classes/Marker";
import Vector from "./classes/Vector";
import MarkerController from "./controller/MarkerController";
import MenuElement from "./interface/MenuElement";
import Blip from "./classes/Blip";
import BlipController from "./controller/BlipController";

var ESX = null
var CurrentGreenhouse: Greenhouse
ESX = global.exports.es_extended.getSharedObject()


on('onClientResourceStart', (resource) => {
    if (resource != GetCurrentResourceName()) {return}
    __init()
})

function __init() {
    ESX.TriggerServerCallback('esx_greenhouse?GetGreenhouses', (greenhouses: Array<Greenhouse>) => {
        for (const key in greenhouses) {
            const element = greenhouses[key]
            var marker = new Marker(element.name, new Vector(element.coords.x, element.coords.y, element.coords.z),  {r: 255, g: 255, b: 255, a: 100}, 2, 1, true)
            marker.onSubmit.on((marker: Marker) => {
                _InitGreenhouseMainMenu(element)
            })
            marker.onExit.on((marker: Marker) => {
                ESX.UI.Menu.CloseAll()
            })
            MarkerController.AddMarker(marker)


            var blip = new Blip("greenhouse"+element.id, "Gewächshäuser", new Vector(element.coords.x, element.coords.y, element.coords.z), 557, 4, 1.2, 52)
            BlipController.addBlipToCategory("greenhouses", blip)
        }
        BlipController.createBlipsOfCategory("greenhouses")
    })
}

function _InitGreenhouseMainMenu(house: Greenhouse) {
    CurrentGreenhouse = house

    ESX.TriggerServerCallback("esx_greenhouse?IsOwnerOfGreenhouse", (isOwner) => {
        switch (isOwner) {
            case true:  OpenMainGreenhouseMenu();break;
            case false: OpenBuyGreenhouseMenu();break;        
            default:    OpenBuyGreenhouseMenu();break;
        }
    }, CurrentGreenhouse.id)
}

//#region MainMenu
function OpenMainGreenhouseMenu() {
    ESX.TriggerServerCallback("esx_greenhouse?GetDataOfGreenhouse", (data) => {
        CurrentGreenhouse.data = data
    }, CurrentGreenhouse.id)

    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "greenhouse_main_menu", {
        title: "Gewächshaus",
        elements: [
            {name: "amount_zones", label: "[<span style='color:#1ABC9C'>i</span>] Anzahl Stellplätze: <span style='color:#1ABC9C'>"+CurrentGreenhouse.zones+"</span>"},
            {name: "zones", label: "[<span style='color:#E54363'>&#10095;</span>] Stellplätze"},
            {name: "cargo", label: "[<span style='color:#E54363'>&#10095;</span>]  Lagerplätze"},
            {name: "shop", label: "[<span style='color:#E54363'>&#10095;</span>] Shop"},
            {name: "extras", label: "[<span style='color:#E54363'>&#10095;</span>] <span style='color:gray;text-decoration:line-through;font-style: italic'>Erweiterungen</span>"},
            {name: "sell", label: " [<span style='color:#E54363'>&#10095;</span>] <span style='color:#E54363'>Verkaufen</span>"}
        ]
    }, (data, menu) => {
        switch (data.current.name) {
            case "zones": OpenZonesMenu();break;
            case "sell": OpenSellGreenhouseMenu();break;
            case "cargo": OpenCargoMenu();break;
            case 'shop': OpenShopMenu();break;
            case 'extras': GreenhouseNotify("Aktuell kann dein Gewächshaus nicht erweitert werden. Wir geben dir bescheid wenn es soweit ist")
            default:
                break;
        }
    }, (data, menu) => {
        menu.close()
        MarkerController.CurrentMarker.submitted = false
    })
}
//#endregion

//#region ZonesMenu
function OpenZonesMenu() {
    var elements: any  = new Array<MenuElement>
    for (const i in CurrentGreenhouse.data.zones) {
        let obj = CurrentGreenhouse.data.zones[i]
        let plantname = (obj.pgh_p_label) ? obj.pgh_p_label : "frei"
        elements.push({
            name: obj.pgh_z_name,
            label: "[<span style='color:#E54363'>&#10095;</span>]" + obj.pgh_z_label + " (<span style='color:#1ABC9C'>" + plantname + "</span>)",
            index: i,
            data: obj
        })
        
    }
    
    
    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "zone_menu", {
        title: "Stellplätze",
        elements: elements
    }, (data, menu) => {
        OpenPlantMenu(data.current.data)
    }, (data, menu) => {
        menu.close()
    })
}
//#endregion

//#region PlantMenu
function OpenPlantMenu(zone) {
    var label = zone.pgh_p_label ? zone.pgh_p_label : "keine"
    var amount = zone.pgh_z_amount ? zone.pgh_z_amount : 0
    var stage = zone.pgh_ps_label ? zone.pgh_ps_label : "keine"
    var id = zone.pgh_p_id ? zone.pgh_p_id : 0
    var planted = zone.pgh_z_planted ? zone.pgh_z_planted : "gar nicht"
    var last_growed = zone.pgh_z_last_growed ? zone.pgh_z_last_growed : "gar nicht"

    var elements = [
        {name: "l_plant",label: "[<span style='color:#1ABC9C'>i</span>] Pflanze: <span style='color:#1ABC9C'>"+label+"</span>",type: "default"},
        {name: "l_amount",label: "[<span style='color:#1ABC9C'>i</span>] Ertrag: <span style='color:#1ABC9C'>"+amount+"g</span>",type: "default"},
        {name: "l_stage",label: "[<span style='color:#1ABC9C'>i</span>] Wachstumsstufe: <span style='color:#1ABC9C'>"+stage+"</span>",type: "default"},
        {name: "l_planted",label: "[<span style='color:#1ABC9C'>i</span>] Gepflanzt: <span style='color:#1ABC9C'>"+planted+"</span>",type: "default"},
        {name: "l_last_growed",label: "[<span style='color:#1ABC9C'>i</span>] Gewachsen: <span style='color:#1ABC9C'>"+last_growed+"</span>",type: "default"},
        //{name: "l_percent", label: `<div style="height:22px;width:100%;background-color:white"><div style="height:100%;width:40%;background-color:#1ABC9C;"></div></div>`, type:"springText"},   ====> IDEA: Percentagebar instead of text
        {name: "l_number",label: "[<span style='color:#1ABC9C'>i</span>] Pflanzen-Nr: <span style='color:#1ABC9C'>"+id+"</span>",type: "default"},
    ]


    if (label === "keine" || stage === "keine") {
        elements.push({name: "a_plant", label: "[<span style='color:#E54363'>&#10095;</span>] <span style='color:#E54363'>Anbauen</span>", type: "default"})
    } else if (zone.pgh_ps_name == "grow_4") {
        elements.push({name: "a_destroy", label: "[<span style='color:#E54363'>&#10095;</span>] <span style='color:#E54363'>Zerstören</span>", type: "default"})
        elements.push({name: "a_harvest", label: "[<span style='color:#E54363'>&#10095;</span>] <span style='color:#E54363'>Ernten</span>", type: "default"})
    } else {
        elements.push({name: "a_destroy", label: "[<span style='color:#E54363'>&#10095;</span>] <span style='color:#E54363'>Zerstören</span>", type: "default"})
        elements.push({name: "a_harvest_blocked", label: "[<span style='color:#E54363'>&#10095;</span>] <span style='color:gray;text-decoration:line-through;font-style: italic'>Ernten</span>", type: "default"})
    }


    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "plant_info_menu", {
        title: "Pflanzeninfo",
        elements: elements
    }, (data, menu) => {

        switch (data.current.name) {
            case "a_plant":OpenPlantCropsMenu(zone);break;
            case "a_harvest":OpenPlantHarvestMenu(zone);break;
            case "a_destroy":OpenPlantDestroyMenu(zone);break;
        
            default:GreenhouseNotify("Diese Aktion kann momentan nicht durchgeführt werden")
                break;
        }

    }, (data, menu) => {
        menu.close()
    })
}

function OpenPlantCropsMenu(zone) {
    var currWeight = 0
    if (CurrentGreenhouse.data.cargo.length == 0) {GreenhouseNotify("Das Lager scheint leer zu sein, kaufe zuerst Samen im Shop um eine Pflanzen anzubauen."); return}
    for (let i in CurrentGreenhouse.data.cargo) {
        let obj = CurrentGreenhouse.data.cargo[i]
        currWeight += (obj.pgh_c_amount*obj.pgh_p_weight)
    }
    
    var elements:MenuElement[] = [
        {
            name: "weight",
            label: "[<span style='color:#1ABC9C'>i</span>] Platzverbrauch: <span style='color:#1ABC9C'>"+currWeight.toLocaleString("us-US")+"</span> / <span style='color:#E54363'>"+CurrentGreenhouse.maxCargo.toLocaleString("us-US")+"</span>g",
            type: "default",
        }
    ]

    for (let i in CurrentGreenhouse.data.cargo) {
        let obj = CurrentGreenhouse.data.cargo[i]
        var itemname = obj.pgh_p_label
        if (obj.pgh_ct_name == "seed") {
            itemname = obj.pgh_p_label+"samen"
            elements.push({
                name: obj.pgh_p_name,
                data: obj,
                label: "<span style='color:#E54363'>"+(obj.pgh_c_amount*obj.p_weight)+"</span>g "+itemname,
                min: 1,
                max: obj.pgh_c_amount,
                value: 1,
            })
            continue
        }
    }

    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "cargo_menu", {
        title: "Lager",
        elements: elements
    }, (data, menu) => {
        OpenValidateMenu((check) => {
            if (!check) {return}
            ESX.TriggerServerCallback('esx_greenhouse?PlantSeed', (planted) => {
                if (!planted) {return}
                _InitGreenhouseMainMenu(CurrentGreenhouse)
                GreenhouseNotify(`Du hast erfolgreich eine ${data.current.data.pgh_p_label} angebaut.`)
            }, zone, CurrentGreenhouse, data.current.data)
        })
    }, (data, menu) => {
        menu.close()
    })
}

function OpenPlantHarvestMenu(zone) {
    OpenValidateMenu((check) => {
        if (!check) {return}
        ESX.TriggerServerCallback("esx_greenhouse?HarvestPlant", (harvested) => {
            if (!harvested) {return}
                 _InitGreenhouseMainMenu(CurrentGreenhouse)
                GreenhouseNotify(`Du hast erfolgreich die Pflanze geerntet.`)
        }, zone, CurrentGreenhouse)
    })
}

function OpenPlantDestroyMenu(zone) {
    OpenValidateMenu((check) => {
        if (!check) {return}
        ESX.TriggerServerCallback("esx_greenhouse?DestroyPlant", (destroyed) => {
            if (!destroyed) {return}
            _InitGreenhouseMainMenu(CurrentGreenhouse)
            GreenhouseNotify(`Du hast erfolgreich die Pflanze zerstört.`)
        }, zone, CurrentGreenhouse)
    })
}
//#endregion

//#region CargoMenu
function OpenCargoMenu() {
    var currWeight = 0
    for (let i in CurrentGreenhouse.data.cargo) {
        let obj = CurrentGreenhouse.data.cargo[i]
        if (obj.pgh_ct_id == 1) {
            currWeight += (obj.pgh_c_amount*obj.pgh_p_weight)
        } else {
            currWeight += (obj.pgh_c_amount*obj.p_weight)
        }
        
    }
    
    var elements:MenuElement[] = [
        {
            name: "weight",
            label: "[<span style='color:#1ABC9C'>i</span>] Platzverbrauch: <span style='color:#1ABC9C'>"+currWeight.toLocaleString("us-US")+"</span> / <span style='color:#E54363'>"+CurrentGreenhouse.maxCargo.toLocaleString("us-US")+"</span>g",
            type: "default",
        }
    ]
    
    for (let i in CurrentGreenhouse.data.cargo) {
        let obj = CurrentGreenhouse.data.cargo[i]
        var itemname = obj.pgh_p_label
        if (obj.pgh_ct_name == "seed") {
            itemname = obj.pgh_p_label+"samen"
            elements.push({
                name: obj.pgh_p_name,
                data: obj,
                label: "<span style='color:#E54363'>"+(obj.pgh_c_amount*obj.p_weight)+"</span>g "+itemname,
                min: 1,
                max: obj.pgh_c_amount,
                value: 1,
            })
            continue
        }
        elements.push({
            name: obj.pgh_p_name,
            data: obj,
            label: "<span style='color:#1ABC9C'>"+(1*obj.pgh_p_weight)+"</span>g/<span style='color:#E54363'>"+(obj.pgh_c_amount*obj.pgh_p_weight)+"</span>g "+itemname,
            type: "slider",
            min: 1,
            max: obj.pgh_c_amount,
            value: 1,
        })
    }

    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "cargo_menu", {
        title: "Lager",
        elements: elements
    }, (data, menu) => {
        if (data.current.data.pgh_ct_name != "crop") {return}
        OpenCargoSellMenu(data.current)
    }, (data, menu) => {
        menu.close()
    }, (data, menu) => {
        if (data.current.name == "weight") {return}
        var label = "<span style='color:#1ABC9C'>"+(data.current.value*data.current.data.pgh_p_weight)+"</span>/<span style='color:#E54363'>"+(data.current.max*data.current.data.pgh_p_weight)+"</span>g "+data.current.data.pgh_p_label
        if (data.current.label == label || data.current.data.pgh_ct_name == "seed") {return}
        let index = 0
        for (let i in data.elements) {
            let obj = data.elements[i]
            if (obj.name == "weight") {continue}
            if (obj.data.pgh_p_name == data.current.data.pgh_p_name && obj.data.pgh_ct_name == data.current.data.pgh_ct_name) {
                index = parseInt(i)
            }
        }
        index++
        menu.setElement(index, "label", label)
        menu.setElement(index, "value", data.current.value)
        menu.refresh()
    })
}

function OpenCargoSellMenu(object) {
    const crop = object.value*object.data.pgh_p_weight
    const win = Math.floor((crop/1000)*object.data.pgh_p_sellprice).toFixed(2)
    
    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "yield_sell_menu", {
        title: "Lager",
        elements: [
            {name: "i_crop", label: "Pflanze: <span style='color:#1ABC9C'>"+object.data.pgh_p_label+"</span>", type: "springText"},
            {name: "i_selected", label: "Ertrag: <span style='color:#1ABC9C'>"+crop+"</span>g", type: "springText"},
            {name: "i_win", label: "Summe: $<span style='color:#1ABC9C'>"+win+"</span>", type: "springText"},
            {name: "a_submit", label: "<span style='color:#E54363'>Verkaufen</span>", arrow: true}
        ]
    }, (data, menu) => {
        OpenValidateMenu((check) => {
            if (!check) {return}
            ESX.TriggerServerCallback("esx_greenhouse?SellCargo", (selled, item, weight, price) => {
                if (selled) {
                    _InitGreenhouseMainMenu(CurrentGreenhouse)
                    GreenhouseNotify(`Du hast erfolgreich ~g~${weight}~w~g ~g~${item}~w~ für $~g~${price}~w~ verkauft.\n\nDas Geld stecke ich dir mal zu, unsere Banküberweisungen funktionieren noch nicht.`)
                    return
                }
                GreenhouseNotify(`Der Verkauf war nicht erfolgreich.`)
                _InitGreenhouseMainMenu(CurrentGreenhouse)
            }, object, CurrentGreenhouse)
        })
    }, (data, menu) => {
        menu.close()
    })
}
//#endregion

//#region ShopMenu
function OpenShopMenu() {
    var currWeight = 0
    for (let i in CurrentGreenhouse.data.cargo) {
        let obj = CurrentGreenhouse.data.cargo[i]
        currWeight += (obj.pgh_c_amount*obj.pgh_p_weight)
    }
    
    var elements:MenuElement[] = [
        {
            name: "weight",
            label: "[<span style='color:#1ABC9C'>i</span>] Platzverbrauch: <span style='color:#1ABC9C'>"+currWeight.toLocaleString("us-US")+"</span> / <span style='color:#E54363'>"+CurrentGreenhouse.maxCargo.toLocaleString("us-US")+"</span>g",
            type: "default",
        }
    ]

    for (let i in CurrentGreenhouse.data.plants) {
        let obj = CurrentGreenhouse.data.plants[i]
        elements.push({
            name: obj.pgh_p_name,
            label: "<span style='color:#1ABC9C'>"+(1*obj.p_weight)+"</span>g "+obj.pgh_p_label+"samen $<span style='color:#E54363'>"+(1*obj.pgh_p_price)+"</span>",
            type: "slider",
            min: 1,
            max: 10,
            data: obj,
            value: 1,
        })
    }

    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "shop_menu", {
        title: "Shop",
        elements: elements
    }, (data, menu) => {
        if ((data.current.value*data.current.data.p_weight) > (CurrentGreenhouse.maxCargo-currWeight)) {
            const leftspace = CurrentGreenhouse.maxCargo-currWeight
            const plannedburchase = data.current.value*data.current.data.p_weight
            const overweight = (plannedburchase) - (leftspace)
            GreenhouseNotify("Für dein geplanten Einkauf ist das Lager leider nicht groß genug.\n\nGeplanter Einkauf: "+plannedburchase+"g\nÜbriger Platz: "+leftspace+"g\nDifferenz: "+overweight+"g")
            return
        }
        OpenShopBuyMenu(data.current)
    }, (data, menu) => {
        menu.close()
    }, (data, menu) => {
        if (data.current.name == "weight") {return}
        var label = "<span style='color:#1ABC9C'>"+(data.current.value*data.current.data.p_weight)+"</span>g "+data.current.data.pgh_p_label+"samen $<span style='color:#E54363'>"+(data.current.value*data.current.data.pgh_p_price)+"</span>"
        if (data.current.label == label) {return}
        let index = 0
        for (let i in data.elements) {
            let obj = data.elements[i]
            if (obj.name == "weight") {continue}
            if (obj.data.pgh_p_name == data.current.data.pgh_p_name) {
                index = parseInt(i)
            }
        }
        index++
        menu.setElement(index, "label", label)
        menu.setElement(index, "value", data.current.value)
        menu.refresh()
    })
}

function OpenShopBuyMenu(object) {
    const crop = object.value*object.data.p_weight
    const price = Math.floor(object.value*object.data.pgh_p_price).toFixed(2)
    
    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "shop_buy_menu", {
        title: "Kaufbestätigung",
        elements: [
            {name: "i_item", label: "[<span style='color:#1ABC9C'>i</span>] Gegenstand: <span style='color:#1ABC9C'>"+object.data.pgh_p_label+"samen</span>", type: "default"},
            {name: "i_selected", label: "[<span style='color:#1ABC9C'>i</span>] Menge: <span style='color:#1ABC9C'>"+crop+"</span>g", type: "default"},
            {name: "i_win", label: "[<span style='color:#1ABC9C'>i</span>] Summe: $<span style='color:#1ABC9C'>"+price+"</span>", type: "default"},
            {name: "a_submit", label: "[<span style='color:#E54363'>&#10095;</span>] <span style='color:#E54363'>Kaufen</span>"}
        ]
    }, (data, menu) => {
        OpenValidateMenu((check) => {
            if (!check) {return}
            ESX.TriggerServerCallback("esx_greenhouse?BuySeeds", (buyed, item, weight, price) => {
                if (buyed) {
                    _InitGreenhouseMainMenu(CurrentGreenhouse)
                    GreenhouseNotify(`Du hast erfolgreich ~g~${weight}~w~g ~g~${item}samen~w~ für $~g~${price}~w~ gekauft.\nDas Geld musst du mir in bar geben, da Banküberweisungen momentan nicht funktionieren.`)
                    return
                }
                GreenhouseNotify(`Der Kauf war nicht erfolgreich.`)
                _InitGreenhouseMainMenu(CurrentGreenhouse)
            }, object, CurrentGreenhouse)
            
        })
    }, (data, menu) => {
        menu.close()
    })
}
//#endregion

//#region Buy / Sell Greenhouse Menu
function OpenBuyGreenhouseMenu() {
    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "greenhouse_buy_menu", {
        title: "Gewächshaus",
        elements: [
            {name: "l_name", label: "[<span style='color:#1ABC9C'>i</span>] Bezeichnung: <span style='color:#1ABC9C'>"+CurrentGreenhouse.label+"</span>"},
            {name: "l_cargo", label: "[<span style='color:#1ABC9C'>i</span>] Lagerkapazität: <span style='color:#1ABC9C'>"+(CurrentGreenhouse.maxCargo/1000).toLocaleString("us-US")+"</span> kg"},
            {name: "l_items", label: "[<span style='color:#1ABC9C'>i</span>] Anbauoptionen: <span style='color:#1ABC9C'>"+"keine"+"</span>"},
            {name: "l_space", label: "[<span style='color:#1ABC9C'>i</span>] Stellplätze: <span style='color:#1ABC9C'>"+CurrentGreenhouse.zones+"</span>"},
            {name: "l_price", label: "[<span style='color:#1ABC9C'>i</span>] Preis: $ <span style='color:#1ABC9C'>"+CurrentGreenhouse.price.toLocaleString("us-US")+"</span>"},
            {name: "a_buy", label: "[<span style='color:#E54363'>&#10095;</span>] <span style='color:#E54363'>Kaufen</span>"}
        ]
    }, (data, menu) => {
        if (data.current.name == "a_buy") {
            OpenValidateMenu((check) => {
                if (!check) {return}
                ESX.TriggerServerCallback('esx_greenhouse?BuyGreenhouse', (buyed) => {
                    if (buyed) {
                        _InitGreenhouseMainMenu(CurrentGreenhouse)
                        GreenhouseNotify("Sie haben dieses Objekt erfolgreich für $~g~"+CurrentGreenhouse.price.toLocaleString("us-US")+" ~r~gekauft~w~.")
                        return
                    }
                    GreenhouseNotify("Sie haben nicht genügend Geld dabei, um dieses Objekt zu kaufen")
                }, CurrentGreenhouse.id)
            })
        }
    }, (data, menu) => {
        menu.close()
        MarkerController.CurrentMarker.submitted = false
    })
}


function OpenSellGreenhouseMenu() {
    var l_items = "keine"
    var l_extra = 0
    if (CurrentGreenhouse.data.plants.length != 0) {
        l_items = ""
        for (const i in CurrentGreenhouse.data.plants) {
            var obj = CurrentGreenhouse.data.plants[i]
            if (parseInt(i) < (CurrentGreenhouse.data.plants.length - 1)) {
                l_items += obj.pgh_p_label+", "
                continue
            }
            l_items += obj.pgh_p_label
        }
    }

    if (CurrentGreenhouse.data.cargo.length != 0) {
        for (const i in CurrentGreenhouse.data.cargo) {
            var ival = CurrentGreenhouse.data.cargo[i]
            if (ival.pgh_ct_name == "seed") {continue}
            const weight = ival.pgh_c_amount * ival.pgh_p_weight
            const price = (weight/1000)*ival.pgh_p_sellprice
            l_extra += price
        }
    }

    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "sell_menu", {
        title: "Gewächshaus",
        elements: [
            {name: "l_name", label: "Bezeichnung: <span style='color:#1ABC9C'>"+CurrentGreenhouse.label+"</span>", type: "default"},
            {name: "l_cargo", label: "Lagerkapazität: <span style='color:#1ABC9C'>"+(CurrentGreenhouse.maxCargo/1000).toLocaleString("us-US")+"</span> kg", type: "default"},
            {name: "l_items", label: "Anbauoptionen: <span style='color:#1ABC9C'>"+l_items+"</span>", type: "default"},
            {name: "l_space", label: "Stellplätze: <span style='color:#1ABC9C'>"+CurrentGreenhouse.data.zones.length+"</span>", type: "default"},
            {name: "l_price", label: "Preis: $ <span style='color:#1ABC9C'>"+CurrentGreenhouse.price.toFixed(2)+"</span>", type: "default"},
            {name: "l_extra", label: "Lagerverkauf: $ <span style='color:#1ABC9C'>"+l_extra.toFixed(2)+"</span>", type: "default"},
            {name: "a_sell", label: "<span style='color:#E54363'>Verkaufen</span>", arrow: true}
        ]
    }, (data, menu) => {
        if (data.current.name == "a_sell") {
            OpenValidateMenu((check) => {
                if (!check) {return}
                ESX.TriggerServerCallback('esx_greenhouse?SellGreenhouse', (selled, price, extra) => {
                    
                    if (selled) {
                        _InitGreenhouseMainMenu(CurrentGreenhouse)
                        if (extra > 0) {
                            GreenhouseNotify("Sie haben dieses Objekt erfolgreich für $~g~"+price.toLocaleString("us-US")+" ~r~verkauft~w~. Zusätzlich haben Sie, aufgrund noch vorhandener Waren im Lager, $~g~"+extra.toLocaleString("us-US")+" ~r~erhalten~w~.")
                            return
                        }
                        GreenhouseNotify("Sie haben dieses Objekt erfolgreich für $~g~"+price.toLocaleString("us-US")+" ~r~verkauft~w~.")
                        return
                    }
                    _InitGreenhouseMainMenu(CurrentGreenhouse)
                    GreenhouseNotify("Der Verkauf ist leider fehlgeschlagen.")
                }, CurrentGreenhouse)
            })
        }
    }, (data, menu) => {
        menu.close()
    })
}

//#endregion

//#region Menu: ValidateMenu
function OpenValidateMenu(cb) {
    ESX.UI.Menu.Open("default", GetCurrentResourceName(), "validate_menu", {
        title: "Validierung",
        elements: [
            {name: "approve", label: "Bestätigen"},
            {name: "cancel", label: "Abbrechen"}
        ]
    }, (data, menu) => {
        switch (data.current.name) {
            case "approve": cb(true);ESX.UI.Menu.CloseAll();break;
            case "cancel": cb(false);menu.close();break;
            default:cb(false);ESX.UI.Menu.CloseAll();break;
        }
    }, (data, menu) => {
        menu.close()
    })
}
//#endregion


function GreenhouseNotify(msg) {
    ESX.ShowAdvancedNotification("Mrs. Thornhill", "Gewächshausverwaltung", msg, "CHAR_MRS_THORNHILL", 1, false, true)
}


//#region Marker
setInterval(() => {
    if (MarkerController.Markers[MarkerController.CurrentZone] != undefined) {
        for (const key in MarkerController.Markers[MarkerController.CurrentZone]) {
            const marker = MarkerController.Markers[MarkerController.CurrentZone][key]
            marker.Draw()
        }
    }
})

setInterval(() => {
    var player = Vector.GetEntityVector(PlayerPedId())

    MarkerController.UpdateCurrentZone(player)
    if (MarkerController.Markers[MarkerController.CurrentZone] != undefined) {
        for (const marker of MarkerController.Markers[MarkerController.CurrentZone]) {
            marker.Check(player)
            if (marker.visible) {
                if (!marker.active && player.Length(marker.coords) <= marker.size) {
                    marker.active = true
                    marker.onEnter.emit(marker)
                    MarkerController.CurrentMarker = marker
                }

                if (marker.active && player.Length(marker.coords) > marker.size) {
                    marker.active = false
                    marker.onExit.emit(marker)
                    MarkerController.CurrentMarker = undefined
                    ESX.HideUI()
                }
            }
        }
    }
}, 100)

setInterval(() => {
    if (MarkerController.CurrentMarker?.name != undefined && !MarkerController.CurrentMarker?.submitted) {
        ESX.TextUI("Drücke [E] um mit diesem Punkt zu interagieren.")
        if (IsControlJustPressed(0, 51)) {
            ESX.HideUI()
            MarkerController.CurrentMarker.onSubmit.emit(MarkerController.CurrentMarker)
            MarkerController.CurrentMarker.submitted = true
        }
    }
})
//#endregion


//#region Events
onNet('esx_greenhouse!PlantHarvestable', (greenhouseLabel, plantzoneLabel, plantLabel, plantAmount) => {
    GreenhouseNotify(`Die ~g~${plantLabel}pflanze ~s~ist bereit zum ~g~Ernten~s~.~n~Ertrag: ~g~${plantAmount}~s~g.~n~Stellplatz: ~g~${plantzoneLabel}~s~.~n~Gebäude: ~g~${greenhouseLabel}~s~.`)
})
//#endregion