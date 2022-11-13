export default class Vector {
    x: number = 0.0
    y: number = 0.0
    z: number = 0.0
    z2?: number

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    Length(vec?: Vector) {
        var height = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)

        if (vec == undefined) {return height}

        var a = Math.abs(this.x - vec.x)
        var b = Math.abs(this.y - vec.y)
        var c = Math.abs(this.z - vec.z)

        var length = Math.sqrt(a*a + b*b + c*c)

        return length
    }

    GetVectorAsString() {
        return JSON.stringify({x: this.x, y: this.y, z: this.z})
    }

    GetVectorData() {
        return {x: this.x, y: this.y, z: this.z}
    }

    static GetEntityVector(entity: number) {
        var entityCoords = GetEntityCoords(entity, false)
        var entityVector = new Vector(entityCoords[0], entityCoords[1], entityCoords[2])
        return entityVector
    }

}