import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import indigo from 'material-ui/colors/indigo'
import lightBlue from 'material-ui/colors/lightBlue'
import red from 'material-ui/colors/red'
import purple from 'material-ui/colors/purple';
import green from 'material-ui/colors/green';
import {
    cyan,
    blue,
    teal,
    darkBlack,
    white,
    grey,

    blueGrey
} from 'material-ui/colors';


let palette={
    primary: props.config.themeColorName=="blueGrey"?blueGrey: 
             props.config.themeColorName=="purple"?purple:
             props.config.themeColorName=="cyan"?cyan:
             props.config.themeColorName=="teal"?teal:blue,
    secondary: {
      ...green,
      A400: '#00e677',
    },
    error: red,
  }
export const theme = createMuiTheme({
    palette: palette
  });
  
// export const theme = createMuiTheme({



//     grey: {


//         palette: {
//             primary: grey,
//             second: blueGrey,

//         }
//     },
    // blue: {

    //     palette: {
    //         primary: blue,
    //         second: blue,

    //     }

    // },
    // teal: {





    //     palette: {
    //         primary: teal,
    //         second: cyan,

    //     }

    // },
    // indigo: {




    //     palette: {
    //         primary: indigo,
    //         second: indigo,

    //     }

    // }

//});