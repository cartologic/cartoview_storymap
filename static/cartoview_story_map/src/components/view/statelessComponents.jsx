import List, { ListItem, ListItemText } from 'material-ui/List'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import ReactDOM from 'react-dom'
import Button from 'material-ui/Button'
import { Carousel } from 'react-responsive-carousel'
import CartoviewList from './CartoviewList'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'
import Drawer from 'material-ui/Drawer'
import Grid from 'material-ui/Grid'
import IconButton from 'material-ui/IconButton'
import Img from 'react-image'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import SendIcon from 'material-ui-icons/Send'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import { checkURL } from '../../containers/staticMethods'
import noImage from '../../img/no-img.png'
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import AddIcon from 'material-ui-icons/Add';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import EditIcon from 'material-ui-icons/Edit';

export const Loader = (props) => {
    const style = { textAlign: 'center' }
    return (
        <div style={style} >
            <CircularProgress size={50} thickness={5} style={style}></CircularProgress>
        </div>
    )
}
export const Message = (props) => {
    const { align, type, message } = props
    return <Typography type={type} align={align || "center"} color="inherit" style={{ flex: 1 }}>{message}</Typography>
}
Message.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    align: PropTypes.string
}
export const Item = (props) => {

    const { openDetails, classes, feature, attachment, config } = props
    return <div >
        <Card className="Scrollable" onClick={() => openDetails({ detailsOfFeature: feature })}>
            <CardHeader

                title={`${feature.getProperties()[config.titleAttribute]}`}
                subheader={`${config.subtitleAttribute ? feature.getProperties()[config.subtitleAttribute] : ''}`} />

            <Img className={classes.bigAvatar}
                src={[
                    attachment.length > 0 ? attachment[0].file : '../../img/no-img.png'
                ]}
                loader={<Loader />} />
            <CardContent>
                <Typography component="p">
                    {config.description ? feature.getProperties()[config.description] : ''}
                </Typography>
            </CardContent>
        </Card>
        <Divider />
        <br />
    </div>
}
Item.propTypes = {
    classes: PropTypes.object.isRequired,
    feature: PropTypes.object.isRequired,
    attachment: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired,
    openDetails: PropTypes.func.isRequired,

}
$('#contents').scroll(function () {
    // scrollPosition = $(this).scrollTop();
    console.log("scroll")
});

export class FeatureListComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            features: this.props.features ? this.props.features : []
        }
    }
    onSortEnd = ({ oldIndex, newIndex }) => {
        const { openDetails } = this.props
        if (oldIndex == newIndex) {

            $('.image-container').removeClass("inFocus").addClass("outFocus");
            $('#id' + newIndex).removeClass("outFocus").addClass("inFocus");
            openDetails({ detailsOfFeature: this.state.features[newIndex] }, console.log("done"))
        }
        console.log("features", this.state.features)
        this.setState({
            features: arrayMove(this.state.features, oldIndex, newIndex),
        });
    };
    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        this.setState({ features: nextProps.features })
    }
  
    render() {

        const {
            features,
            featuresIsLoading,
            subheader,
            message,
            classes,
            config,
            attachmentIsLoading,
            searchFilesById,
            openDetails,
            addEntry
        } = this.props

        const SortableItem = SortableElement(({ value, sortIndex, index }) =>
            <div className="card-div" >
                < Card id={"id" + sortIndex} className='image-container'>
                    <CardHeader
                        title={`${value.getProperties()[config.titleAttribute]}`}
                        subheader={`${config.subtitleAttribute ? value.getProperties()[config.subtitleAttribute] : ''}`} />
                    <Img className={classes.bigAvatar} style={{ height: "250px" }} src={[urls.static + 'cartoview_story_map/img/no-img.png'
                    ]} loader={<Loader />} />
                    <CardContent>
                        <Typography component="p">
                            {config.description ? value.getProperties()[config.description] : ''}
                        </Typography>
                    </CardContent>
                </Card>
                <Divider />
                <br />
            </div>
        );
        const SortableList = SortableContainer(({ items }) => {
            return (
                <div>
                    {items.map((value, index) => (
                        <SortableItem
                            key={`item-${index}`}
                            index={index}
                            sortIndex={index}
                            value={value}
                        />
                    ))}
                </div>
            );
        });
        return (
            <div>
                {!featuresIsLoading && !attachmentIsLoading && features && features.length >
                    0 ?
                    <div id="contents"  >
                        <Message align="left" message={subheader} type="subheading" />
                        <List style={{ "marginTop": "10%" }}  >
                            <SortableList items={this.state.features.length > 0 ? this.state.features : features} onSortEnd={this.onSortEnd} />
                        </List>
                    </div> :
                    features && features.length == 0 ?
                        <Message message={message} type="body2" /> :
                        <Loader />}
            </div>
        )
    }
}
FeatureListComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    features: PropTypes.array,
    config: PropTypes.object.isRequired,
    openDetails: PropTypes.func.isRequired,
    subheader: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    attachmentIsLoading: PropTypes.bool.isRequired,
    searchFilesById: PropTypes.func.isRequired
}
export const URL = (props) => {
    const { classes, url } = props
    return <Button color="accent" href={url} className={classes.button}>
        Link
        </Button>
}
URL.propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired
}
export const PropsTable = (props) => {
    const { classes, selectedFeature } = props
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Value</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {Object.keys(selectedFeature.getProperties()).map((key, i) => {
                const value = selectedFeature.getProperties()[key]
                if (key != "geometry" && key != "_layerTitle") {
                    return <TableRow key={i}>
                        <TableCell>{key}</TableCell>
                        <TableCell style={{ whiteSpace: 'pre-line' }}>{checkURL(value) ? <URL url={value} classes={classes} /> : value}</TableCell>
                    </TableRow>
                }
            })}
        </TableBody>
    </Table>
}
PropsTable.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedFeature: PropTypes.object.isRequired
}
export const Slider = (props) => {
    const { attachments } = props
    return <div>
        <Grid container alignItems={'center'} justify={'center'} spacing={0}>
            {attachments.length > 0 ? <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                <Carousel showArrows={true}>
                    {attachments.map(
                        (imageObj, i) => {
                            return <div key={i}>
                                <img src={imageObj.file} />
                                <p className="legend">{`Uploaded by ${imageObj.username}`}</p>
                            </div>
                        }
                    )}
                </Carousel>
            </Grid> : <Message align="center" message={'No Attachments'} type="body1" />}



        </Grid>
    </div>
}
Slider.propTypes = {
    attachments: PropTypes.array.isRequired
}
export const MobileDrawer = (props) => {
    const { theme, mobileOpen, classes, handleDrawerToggle, childrenProps, addEntry } =
        props
    return (
        <Drawer
            type="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            classes={{
                paper: classes.drawerPaper,
            }}
            onRequestClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerToggle}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
            <Divider />
            <Paper className={classes.paper}><CartoviewList addEntry={addEntry} {...childrenProps} /></Paper>
        </Drawer>
    )
}
MobileDrawer.propTypes = {
    mobileOpen: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    handleDrawerToggle: PropTypes.func.isRequired,
    childrenProps: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
}
export const CommentBox = (props) => {
    const { classes, value, handleChange, addComment, hasError } = props
    return (
        <div className={classes.textCenter}>
            {!hasError ? <TextField
                id="multiline-flexible"
                label="Comment"
                multiline
                rowsMax="4"
                value={value}
                onChange={handleChange}
                className={classes.textField}
                margin="normal"
                fullWidth
            /> : <TextField
                    error
                    id="multiline-flexible"
                    label="Comment"
                    multiline
                    rowsMax="4"
                    value={value}
                    onChange={handleChange}
                    className={classes.textField}
                    margin="normal"
                    fullWidth
                />}
            <Button onClick={addComment} raised color="accent" className={classes.button}>
                {`Send`} <SendIcon />
            </Button>
        </div>
    )
}
CommentBox.propTypes = {
    value: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired
}
