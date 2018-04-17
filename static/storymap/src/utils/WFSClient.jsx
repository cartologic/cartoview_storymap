import URLS from './URLS'
import UrlAssembler from 'url-assembler'
import { getCRSFToken } from '../helpers/helpers.jsx'
import ol from 'openlayers'
class WFSClient {
    constructor(urls) {
        this.url = urls.wfsURL
        this.urls = new URLS(urls)
    }
    loadLayerAsJSON(typeName) {
        // returns feature attributes to buildFormSchema
    }
    getURL = (query) => {
        return decodeURIComponent(UrlAssembler(this.url).query(query)
            .toString())
    }
    loadLayerAttributs(typeName) {
        const query = {
            service: 'wfs',
            version: '2.0.0',
            outputFormat: "application/json",
            request: "DescribeFeatureType",
            featureTypes: typeName
        }
        const url = this.getURL(query)
        const proxiedURL = this.urls.getProxiedURL(url)
        // `${this.url}?service=wfs&version=2.0.0&outputFormat=application/json&request=DescribeFeatureType&featureTypes=${typeName}`;
        return fetch(proxiedURL, { credentials: 'include' }).then((res) =>
            res.json())
    }
    loadFeature(typeName, fid) {
        const query = {
            service: 'wfs',
            version: '2.0.0',
            outputFormat: "application/json",
            request: "GetFeature",
            typeNames: typeName,
            featureID: fid
        }
        // returns olFeature based on geoserver existing feature
        const url = this.getURL(query)
        const proxiedURL = this.urls.getProxiedURL(url)
        return fetch(proxiedURL, { credentials: 'include' }).then((res) =>
            res.json())
    }
    sendXMLRequest(xml) {
        const proxiedURL = this.urls.getProxiedURL(this.url)
        return fetch(proxiedURL, {
            method: 'POST',
            body: xml,
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'text/xml',
                "X-CSRFToken": getCRSFToken()
            })
        });
    }
    insertFeature(typeName, properties, geometry) {
        const [namespace, name] = typeName.split(":");

        const xml =
            `<Transaction xmlns="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
          <Insert>
            <${name} xmlns="${namespace}">
              ${Object.keys(properties).map(key => properties[key] == null ? "" : `<${key}>${properties[key]}</${key}>`).join("")}
              <${geometry.name}>
                <Point xmlns="http://www.opengis.net/gml" srsName="${geometry.srsName}">
                  <pos srsDimension="2">${geometry.x} ${geometry.y}</pos>
                </Point>
              </${geometry.name}>
            </${name}>
          </Insert>
        </Transaction>`;
        return this.sendXMLRequest(xml);
    }
    getProps = (properties) => {
        const propsXML = Object.keys(properties).map(key => {
            if (key !== "geometry" && key !== "featureIndex") {
                return (`<Property>
        <Name>${key}</Name>prop
        <Value>${properties[key]}</Value>
      </Property>`)
            }
        })
const xml=`   <wfs:Property>
<wfs:Name>imageid</wfs:Name>
<wfs:Value>${properties['imageid']}</wfs:Value>
</wfs:Property>
`
        return propsXML
    }
    updateFeature(typeName, fid, properties, geometry,ns) {
    
       
        const [namespace, name] = typeName.split(":");
        const featureName="feature:"+name
        const xml_test = `<?xml version="1.0" encoding="UTF-8"?>
        <wfs:Transaction xmlns:wfs="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
           <wfs:Update xmlns:feature="${ns}" typeName="${featureName}">
              <wfs:Property>
                 <wfs:Name>title</wfs:Name>
                 <wfs:Value>${properties['title']}</wfs:Value>
              </wfs:Property>
              <wfs:Property>
              <wfs:Name>description</wfs:Name>
              <wfs:Value>${properties['description']}</wfs:Value>
                </wfs:Property>
                <wfs:Property>
                <wfs:Name>link</wfs:Name>
                <wfs:Value>${properties['link']}</wfs:Value>
                </wfs:Property>
              
                <wfs:Property>
                <wfs:Name>imageurl</wfs:Name>
                <wfs:Value>${properties['imageurl']}</wfs:Value>
                </wfs:Property>
                
                <wfs:Property>
                <wfs:Name>markercolor</wfs:Name>
                <wfs:Value>${properties['markercolor']}</wfs:Value>
                </wfs:Property>
                <wfs:Property>
                <wfs:Name>markershape</wfs:Name>
                <wfs:Value>${properties['markershape']}</wfs:Value>
                </wfs:Property>
                <wfs:Property>
                <wfs:Name>numberscolor</wfs:Name>
                <wfs:Value>${properties['numberscolor']}</wfs:Value>
                </wfs:Property>
                <wfs:Property>
                <wfs:Name>order</wfs:Name>
                <wfs:Value>${properties['order']}</wfs:Value>
                </wfs:Property>
                <wfs:Property>
                <wfs:Name>imageid</wfs:Name>
                <wfs:Value>${properties['imageid']=='null'||properties['imageid']==-1?-1:properties['imageid']}</wfs:Value>
                </wfs:Property>
                <wfs:Property>
                <wfs:Name>the_geom</wfs:Name>
                <wfs:Value>
                <gml:Point xmlns:gml="http://www.opengis.net/gml" srsName="${geometry.srsName}">
                <gml:pos>${geometry.x} ${geometry.y}</gml:pos>
                </gml:Point>
                </wfs:Value>
                </wfs:Property>
              <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                 <ogc:FeatureId fid="${fid}" />
              </ogc:Filter>
           </wfs:Update>
        </wfs:Transaction>`
        return this.sendXMLRequest(xml_test)
    }
}
export default WFSClient;