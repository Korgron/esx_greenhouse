import Vector from "../classes/Vector";
import Marker from "../classes/Marker";

export default class MarkerController {
    static Markers = new Array<Array<Marker>>
    static CurrentMarker: Marker
    static CurrentZone: number = 0

    static AddMarker(marker: Marker) {
        var zone = GetZoneAtCoords(marker.coords.x, marker.coords.y, marker.coords.z)
        if (this.Markers[zone] == undefined) {
            this.Markers[zone] = new Array<Marker>
        }

        this.Markers[zone].push(marker)
    }

    static ClearMarkerListZone(zone) {
        this.Markers[zone] = new Array<Marker>
    }

    static ClearMarkerListTotal() {
        this.Markers = new Array<Array<Marker>>
    }

    static UpdateCurrentZone(vec: Vector) {
        this.CurrentZone = GetZoneAtCoords(vec.x, vec.y, vec.z)
    }

}