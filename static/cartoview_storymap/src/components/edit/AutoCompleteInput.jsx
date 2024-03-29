import { GravatarOption, GravatarValue } from './GavatarOption'
import Select, { AsyncCreatable } from 'react-select'

import React from 'react'

let users = null
let keywords = null
let groups=null
export const getAccessTemplate = ( options ) => {
    function renderInput( locals ) {
        return <div style={{paddingTop:5,paddingBottom:5}} className={locals.hasError?"has-error":""}>
            <label  className={"control-label"}>{locals.label}</label>
            <Select.Async
        {...locals}
        onChange={locals.onChange}
        inputProps={locals.inputProps}
        optionComponent={GravatarOption}
        valueComponent={GravatarValue}
        loadOptions={options.loadOptions}
        value={locals.value}
        multi={true}
        required={false}
        deleteRemoves={true}
        resetValue={[]}
        placeholder={options.message}/>
        </div>
    }

    return renderInput
}
export const getKeywordsTemplate = ( options ) => {
    function renderInput( locals ) {
        return <div style={{paddingTop:5,paddingBottom:5}} className={locals.hasError?"has-error":""}>
            <label  className={"control-label"}>{locals.label}</label>
            <AsyncCreatable
        {...locals}
        onChange={locals.onChange}
        inputProps={locals.inputProps}
        loadOptions={options.loadOptions}
        value={locals.value}
        multi={true}
        deleteRemoves={true}
        resetValue={null}
        placeholder={"Select Or enter Keyword"}/>
        </div>
    }

    return renderInput
}
export const getAccessOptions = ( input, callback ) => {
    if ( !users ) {
        fetch( "/api/profiles/" ).then( ( response ) => response.json( ) )
            .then( ( data ) => {
                users = [ ]
                data.objects.forEach( user => {
                    users.push( {
                        label: user.username,
                        value: user
                            .username,
                        email: user.email
                    } )
                } )
                callback( null, {
                    options: users,
                    complete: true
                } )

            } )
    } else {
        callback( null, {
            options: users,
            complete: true
        } )
    }


}



export const getGroupOptions = ( input, callback ) => {
    if ( !groups ) {
        fetch( "/api/groups/" ).then( ( response ) => response.json( ) )
            .then( ( data ) => {
                groups = [ ]
                data.objects.forEach( group => {
                    groups.push( {
                        label: group.title,
                        value: group.title,
                       
                    } )
                } )
                callback( null, {
                    options: groups,
                    complete: true
                } )

            } )
    } else {
        callback( null, {
            options: groups,
            complete: true
        } )
    }


}
export const getKeywordsOptions = ( input, callback ) => {
    if ( !keywords ) {
        fetch( "/api/keywords" ).then( ( response ) => response.json( ) )
            .then( ( data ) => {
                keywords = [ ]
                data.objects.forEach( keyword => {
                    keywords.push( {
                        label: keyword.name,
                        value: keyword.name,
                    } )
                } )
                callback( null, {
                    options: keywords,
                    complete: true
                } )

            } )
    } else {
        callback( null, {
            options: keywords,
            complete: true
        } )
    }


}
