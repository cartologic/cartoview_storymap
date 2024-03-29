import List, { ListItem, ListItemText } from 'material-ui/List'

import Autosuggest from 'react-autosuggest'
import { MenuItem } from 'material-ui/Menu'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'
import match from 'autosuggest-highlight/match'
import ol from 'openlayers'
import parse from 'autosuggest-highlight/parse'
import { withStyles } from 'material-ui/styles'
import Tooltip from 'material-ui/Tooltip';
// import { Loader, Message } from 'Source/CommonComponents'

import ReactTooltip from 'react-tooltip'

function renderInput(inputProps) {
    const { classes, autoFocus, value, ref, ...
        other } = inputProps
    return (
    
            <TextField

                className={classes.textField}
                value={value}
                inputRef={ref}
                InputProps={{
                    classes: {
                        input: classes.input,
                    },
                    ...other,
                }}
            />
         
       
    )
}
const styles = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative',
        height: 'auto',
        margin: "15px",
        width: "100%",

    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0,

    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    textField: {
        width: '100%',
    },
})
class IntegrationAutosuggest extends React.Component {
    state = {
        value: '',
        suggestions: [],
        label:""
    }
    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        const { action } = this.props
        const matches = match(suggestion.label, query)
        const parts = parse(suggestion.label, matches)
        const lon = parseFloat(suggestion.value.lon)
        const lat = parseFloat(suggestion.value.lat)
        return (
            <MenuItem onTouchTap={() => action([lon, lat])} selected={isHighlighted} component="div">
                <div>
                    {parts.map((part, index) => {
                        return part.highlight ? (
                            <span key={index} style={{ fontWeight: 300 }}>
                                {part.text}
                            </span>
                        ) : (
                                <strong key={index} style={{ fontWeight: 500 }}>
                                    {part.text}
                                </strong>
                            )
                    })}
                </div>
            </MenuItem>
        )
    }
    getSuggestionValue = (suggestion) => {
        return suggestion.label
    }
    renderSuggestionsContainer = (options) => {
        const { classes } = this.props
        const { containerProps, children } = options
        return (
             <div>
            <Paper  data-tip data-for='happyFace' style={{
                zIndex: 1149,
                maxHeight: 200,
                overflow: 'overlay',
            }} className={classes.paperContainer} {...containerProps} square>
             
{children}
            </Paper>
           

            <ReactTooltip   id='happyFace' splace="top" type="dark" effect="float">
  <span >{this.state.label}</span>
</ReactTooltip>
           </div>
        )
    }
    handleSuggestionsFetchRequested = ({ value }) => {
        const { search } = this.props
        search(value, (result) => {
            let suggestions = result.map(obj => {
                return {
                    label: obj.display_name,
                    value: obj
                }
            })
            this.setState({
                suggestions
            })
        })
    }
    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        })
    }
    onSuggestionHighlighted=(suggestion )=>{
if(suggestion.suggestion){this.setState({label:suggestion.suggestion['label']})
    }}
    handleChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        })
    }
    render() {
        const { classes,disable } = this.props
        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderInputComponent={renderInput}
    onSuggestionHighlighted={this.onSuggestionHighlighted}
                
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={{
                 
                    classes,
                    placeholder: `Add Location by Address`,
                    value: this.state.value,
                    onChange: this.handleChange
                }}
            />
        )
    }
}
IntegrationAutosuggest.propTypes = {
    classes: PropTypes.object.isRequired,
    search: PropTypes.func.isRequired,
    action: PropTypes.func.isRequired
}
export default withStyles(styles)(IntegrationAutosuggest)