import * as Leaflet from "react-leaflet"
import * as React from "react"

interface MapState {
    centerLat: number;
    centerLon: number;
    zoom: number;
}

interface MapPointSelectorProps {
    lat: number | null;
    lon: number | null;
    onClick: (lat: (number | null), lon: (number | null)) => void;
}

export default class MapPointSelector extends React.Component<MapPointSelectorProps, MapState> {
    constructor(props: MapPointSelectorProps) {
        super(props)
        this.state = {
            centerLat: 52.1,
            centerLon: 0.12,
            zoom: 12
        }
        if (props.lat != null && props.lon != null) {
            this.state = {
                ...this.state,
                centerLat: props.lat,
                centerLon: props.lon
            }
        } 
    }

    handleMapClick(e: L.MouseEvent): void {
        this.props.onClick(e.latlng.lat, e.latlng.lng)
    }
    handleMarkerClick(e: L.MouseEvent): void {
        this.props.onClick(null, null)
    }
    handleMapStateChange(e : any) : void {
        console.log(e)
    }

    render() {
        let position: L.LatLng | null
        if (this.props.lat==null || this.props.lon==null) {
            position = null
        } else {
            position = L.latLng(this.props.lat, this.props.lon)
        }
        return (
            <Leaflet.Map 
                center={L.latLng(this.state.centerLat, this.state.centerLon)}
                zoom={this.state.zoom}
                onclick={e=>this.handleMapClick(e)}
                onzoomend={e=>this.handleMapStateChange(e)}
                onmoveend={e=>this.handleMapStateChange(e)}
                >
                <Leaflet.TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {position != null &&
                    <Leaflet.Marker position={position} onclick={e=>this.handleMarkerClick(e)}/>
                }
            </Leaflet.Map>
        );
    }
}