import React from "react";
import "./App.css";
import { createBrowserHistory } from "history";
import { SnackbarProvider } from "notistack";
import { Router } from "react-router-dom";
import GlobalStyles from '../src/components/Common/GlobalStyles';
import ScrollReset from '../src/components/Common/ScrollReset';
import routes, { renderRoutes } from "./routes";
import { jssPreset, StylesProvider, ThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import useSettings from "./contextapi/hooks/useSettings";
import { create } from "jss";
import rtl from "jss-rtl";
import MomentUtils from "@date-io/moment";
import { createTheme } from "@material-ui/core/styles";
import { AuthProvider } from "./contextapi/contexts/AuthContextProd";


const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const history = createBrowserHistory();

const App = () => {
    const { settings } = useSettings();

    const theme = createTheme({
        direction: settings.direction,
        responsiveFontSizes: settings.responsiveFontSizes,
        theme: settings.theme
    });    
    return (
        <ThemeProvider theme={theme}>
            <StylesProvider jss={jss}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <SnackbarProvider dense maxSnack={3} >
                        <Router history={history} >
                            <AuthProvider>
                                <GlobalStyles />
                                <ScrollReset />
                                {renderRoutes(routes)}
                            </AuthProvider>
                        </Router>
                    </SnackbarProvider>
                </MuiPickersUtilsProvider>
            </StylesProvider>
        </ThemeProvider>
    );
};

export default App;
