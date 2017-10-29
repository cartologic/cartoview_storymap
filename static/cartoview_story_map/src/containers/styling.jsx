import ol from 'openlayers'

export const styleFunction = ( feature ) => {
  

    const text=props.DisplayNumbersOnMarkers? new ol.style.Text({
        text:feature.getProperties().featureIndex.toString(),
        offsetY:-30,
        scale:1,
        fill: new ol.style.Fill({
          color: '#fff'
        })
    }):""

    const image =new ol.style.Icon(({
    anchor: [0.5, 45],
   anchorXUnits: 'fraction',
   anchorYUnits: 'pixels',
   src: urls.static +'cartoview_story_map/marker.png'
}))

const styles = {
    'Point': new ol.style.Style( { image: image,text:text } ),
    'LineString': new ol.style.Style( {
        stroke: new ol.style.Stroke( { color: 'green', width: 1 } )
    } ),
    'MultiLineString': new ol.style.Style( {
        stroke: new ol.style.Stroke( { color: 'green', width: 1 } )
    } ),
    'MultiPoint': new ol.style.Style( { image: image } ),
    'MultiPolygon': new ol.style.Style( {
        stroke: new ol.style.Stroke( { color: 'yellow', width: 1 } ),
        fill: new ol.style.Fill( { color: 'rgba(255, 255, 0, 0.1)' } )
    } ),
    'Polygon': new ol.style.Style( {
        stroke: new ol.style.Stroke( {
            color: 'blue',
            lineDash: [
                4 ],
            width: 3
        } ),
        fill: new ol.style.Fill( { color: 'rgba(0, 0, 255, 0.1)' } )
    } ),
    'GeometryCollection': new ol.style.Style( {
        stroke: new ol.style.Stroke( { color: 'magenta', width: 2 } ),
        fill: new ol.style.Fill( { color: 'magenta' } ),
        image: new ol.style.Circle( {
            radius: 10,
            fill: null,
            stroke: new ol.style.Stroke( { color: 'magenta' } )
        } )
    } ),
    'Circle': new ol.style.Style( {
        stroke: new ol.style.Stroke( { color: 'yellow', width: 2 } ),
        fill: new ol.style.Fill( { color: 'rgba(255,0,0,0.2)' } )
    } )
}
    // const x=new ol.style.Style( { image: image,text: text } )
    const style = feature ? styles[ feature.getGeometry( ).getType( ) ] :  null

    return style
}
