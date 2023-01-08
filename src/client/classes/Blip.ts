import Vector from "./Vector"

export default class Blip {
    name: string
    label: string
    coords: Vector
    sprite: number
    display: number
    size: number
    color: number
    blip: number

    constructor(name: string, label: string, coords: Vector, sprite: number, display: number, size: number, color: number) {
        this.name = name
        this.label = label
        this.coords = coords
        this.sprite = sprite
        this.display = display
        this.size = size
        this.color = color
    }

    create() {
        this.blip = AddBlipForCoord(this.coords.x, this.coords.y, this.coords.z)
        SetBlipSprite(this.blip, this.sprite)
        SetBlipScale(this.blip, this.size)
        SetBlipColour(this.blip, this.color)
        SetBlipAsShortRange(this.blip, true)
        BeginTextCommandSetBlipName('STRING')
        AddTextComponentSubstringPlayerName(this.label)
        EndTextCommandSetBlipName(this.blip)
    }

    delete() {
        RemoveBlip(this.blip)
    }
}