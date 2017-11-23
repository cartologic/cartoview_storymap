import ol from 'openlayers'

export const styleFunction = (feature) => {

var shape=feature.getProperties().markershape
console.log(shape,feature.getProperties())
    const text = props.config.DisplayNumbersOnMarkers ? new ol.style.Text({
        text: feature.getProperties().order.toString(),
        offsetY: 0,
        scale: 1,
        fill: new ol.style.Fill({
            color: feature.getProperties().numberscolor
        })
    }) : ""
    var image=''
       if(shape=='star'){
                    image = new ol.style.RegularShape({
                            fill: new ol.style.Fill({
                            color:  feature.getProperties().markercolor
                        }) ,
                    
                            points: 5,
                            radius: 15,
                            radius2: 6,
                            angle: 0
                        })}
          else if(shape=='circle'){

              image = new ol.style.Circle({
       fill: new ol.style.Fill({
                            color:  feature.getProperties().markercolor
             }) ,
    
       radius: 10
 });
          }
          else if(shape=='triangle'){
                            image=  new ol.style.RegularShape({
                            fill: new ol.style.Fill({
                            color:  feature.getProperties().markercolor
                        }) ,
                            points: 3,
                            radius: 15,
                            rotation: Math.PI / 4,
                            angle: 0
                        })
          }
          else if(shape=='square')
                        {image=  new ol.style.RegularShape({
                             fill: new ol.style.Fill({
                            color:  feature.getProperties().markercolor
                        }) ,
                           
                            points: 4,
                            radius: 15,
                            angle: Math.PI / 4
                        })}
          else if(shape=='cross'){image=  new ol.style.RegularShape({
            fill: new ol.style.Fill({
                            color:  feature.getProperties().markercolor
                        }) ,
       
            points: 4,
            radius: 10,
            radius2: 0,
            angle: 0
          })}
          else {image= new ol.style.RegularShape({
            fill: new ol.style.Fill({
                            color:  feature.getProperties().markercolor
                        }) ,
        
            points: 4,
            radius: 10,
            radius2: 0,
            angle: Math.PI / 4
          })}
    const styles = {
        'Point': new ol.style.Style({ image: image, text: text }),
        'LineString': new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'green', width: 1 })
        }),
        'MultiLineString': new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'green', width: 1 })
        }),
        'MultiPoint': new ol.style.Style({ image: image }),
        'MultiPolygon': new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'yellow', width: 1 }),
            fill: new ol.style.Fill({ color: 'rgba(255, 255, 0, 0.1)' })
        }),
        'Polygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                lineDash: [
                    4],
                width: 3
            }),
            fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.1)' })
        }),
        'GeometryCollection': new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'magenta', width: 2 }),
            fill: new ol.style.Fill({ color: 'magenta' }),
            image: new ol.style.Circle({
                radius: 10,
                fill: null,
                stroke: new ol.style.Stroke({ color: 'magenta' })
            })
        }),
        'Circle': new ol.style.Style({
            stroke: new ol.style.Stroke({ color: 'yellow', width: 2 }),
            fill: new ol.style.Fill({ color: 'rgba(255,0,0,0.2)' })
        })
    }
    // const x=new ol.style.Style( { image: image,text: text } )
    const style = feature ? styles[feature.getGeometry().getType()] : null

    return style
}
