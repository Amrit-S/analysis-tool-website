import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

import "../css/LoadingScreen.css";

export default function LoadingScreen(props) {
    const useStyles = makeStyles((theme) => ({
        button: {
            "& .MuiButton-root": {
                color: "white",
                background: "#004970",
                border: "1px solid black",
            },
        },
        colorPrimary: {
            backgroundColor: "#A3A3A3",
        },
        barColorPrimary: {
            backgroundColor: "#004970",
        },
    }));

    const classes = useStyles();

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} disableBackdropClick>
                <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    <LinearProgress
                        classes={{
                            colorPrimary: classes.colorPrimary,
                            barColorPrimary: classes.barColorPrimary,
                        }}
                    />
                    <DialogContentText id="alert-dialog-description" className="loading-info-text">
                        Please wait while your data is being processed. This can take up to a few
                        minutes.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
