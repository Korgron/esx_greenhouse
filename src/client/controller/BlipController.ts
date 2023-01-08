import Blip from "../classes/Blip"

export default class BlipController {
    static Blips = new Array<Array<Blip>>

    static addBlipToCategory(category: string, blip: Blip) {
        if (BlipController.Blips[category] == undefined) {
            BlipController.Blips[category] = new Array<Blip>
        }
        BlipController.Blips[category].push(blip)
    }

    static createBlipsOfCategory(category: string) {
        for (const i in BlipController.Blips[category]) {
            var obj = BlipController.Blips[category][i]
            obj.create()
        }
    }

    static deleteBlipsOfCategory(category: string) {
        for (const i in BlipController.Blips[category]) {
            var obj = BlipController.Blips[category][i]
            obj.delete()
        }
    }
}