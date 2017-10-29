import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { PropsTable, Slider } from './statelessComponents'

import Button from 'material-ui/Button'
import Collapsible from './CollapsibleItem'
import CommentsList from './CommentsList'
import Divider from 'material-ui/Divider'
import ImageDialog from './ImageUploadDialog'
import { Message } from './statelessComponents'
import PropTypes from 'prop-types'
import React from 'react'
import { commentsPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui-icons/ArrowBack';
const styles = theme => ( {
    root: {
        background: theme.palette.background.paper,
        padding: theme.spacing.unit * 2
    },
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        width: "80%",
        marginLeft: "10%",
        height: "auto",
    
    },
    loadingCenter: {
        textAlign: 'center'
    },
    pagination: {
        [ theme.breakpoints.down( 'md' ) ]: {
            marginBottom: 40,
        },
    },
    searchMargin: {
        marginBottom: theme.spacing.unit * 2
    },
    flex: {
        flex: 1
    },
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
} )
class addForm extends React.Component {
    constructor( props ) {
        super( props )
    }
    render() {
        const {
            selectedFeature,
            searchFilesById,
            classes,
            back,
            searchCommentById,
            addComment,
            username,
            SaveImageBase64
        } = this.props
        return (
            <div>
                 <IconButton className={classes.button} aria-label="Delete" onClick={() => back()} >
                 <BackIcon />
               </IconButton>
               <p>add form</p>
                <div className={classes.textCenter}>
                  
                </div>
            </div>
        )
    }
}
// ItemDetails.propTypes = { ...commentsPropTypes,
    // searchFilesById: PropTypes.func.isRequired,
    // back: PropTypes.func.isRequired,
    // searchCommentById: PropTypes.func.isRequired,
    // username: PropTypes.string.isRequired,
    // SaveImageBase64: PropTypes.func.isRequired,
// }
export default withStyles( styles )( addForm )
