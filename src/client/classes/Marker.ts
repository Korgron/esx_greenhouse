import LiteEvent from "./LiteEvent";
import Vector from "./Vector";

export default class Marker {
    name = "default_marker";
    coords: Vector;
    color = {r: 0, g: 0, b: 0, a: 0};;
    size = 2;
    type = 1;
    active = false;
    interActive = true;
    isBottom = false;
    length = 0;
    submitted = false;
    
    onExit = new LiteEvent;
    onEnter = new LiteEvent;
    onSubmit = new LiteEvent;
    visible = true;
    enabled = true;

    constructor(name: string, coords: Vector, color, size: number, type: number, isBottom: boolean) {
        this.name = name
        this.coords = coords
        this.color = color
        this.size = size
        this.type = type
        this.isBottom = isBottom
        this.submitted = false
        
        this.coords.z2 = this.coords.z
        if (this.isBottom) {
            this.coords.z2 = this.coords.z - 0.98
        }

        this.onExit.on((marker: Marker) => {
            marker.submitted = false
        })
    
    }


    Draw() {
        if (this.visible && this.enabled) {
            DrawMarker(this.type,this.coords.x,this.coords.y,this.coords.z2,0,0,0,0,0,0,this.size,this.size,this.size,this.color.r,this.color.g,this.color.b,this.color.a,false, false, 2, false, undefined, undefined, false)
        }
    }

    Check(player: Vector) {
        var length = this.coords.Length(player)

        if (length >= 40) {
            this.visible = false
        } else {
            this.visible = true
        }
    }


}