import Marker from "./classes/Marker";
import Vector from "./classes/Vector";
import MarkerController from "./controller/MarkerController";

var ESX = null
emit("esx:getSharedObject", (obj) => ESX = obj);


on('onClientResourceStart', (resource) => {
    if (resource != GetCurrentResourceName()) {return}

    __init()
})

function __init() {
    ESX.TriggerServerCallback('esx_greenhouse?GetGreenhouses', (greenhouses) => {

        for (const key in greenhouses) {
            const element = greenhouses[key]
            var marker = new Marker(element.name, new Vector(element.coords.x, element.coords.y, element.coords.z),  {r: 255, g: 255, b: 255, a: 100}, 2, 1, true)

            marker.onSubmit.on(() => {
                console.log("FUCK YOU")
            })

            marker.onExit.on(() => {
                console.log("Exited Marker")
            })

            marker.onEnter.on(() => {
                console.log("Entered Marker")
            })


            MarkerController.AddMarker(marker)
        }

    })
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

console.log('Client');