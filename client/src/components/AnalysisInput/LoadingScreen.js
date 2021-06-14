/**
 * Loading screen pop-up that displays while data is being parsed on the backend. The pop-up cannot be dismissed by the user, only
 * by its calling function.
 *
 * The component itself is called in AnalysisInput, which triggers when it displays/hides from the user.
 *
 * @summary Renders the loading popup to user.
 * @author Amrit Kaur Singh
 */

import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

import "../../css/LoadingScreen.css";

export default function LoadingScreen({open, handleClose, title, fileCount}) {

    // add styles to material ui components
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

    const calculateRoughTimeEstimate= () => {
        return Math.ceil((-0.0212071 * Math.pow(fileCount, 2)) + (4.81965 * fileCount) + 7.98255);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} disableBackdropClick>
                {/* Title */}
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                {/* Progress Bar */}
                <DialogContent>
                    <LinearProgress
                        classes={{
                            colorPrimary: classes.colorPrimary,
                            barColorPrimary: classes.barColorPrimary,
                        }}
                    />
                    {/* Additional information for the user */}
                    <DialogContentText id="alert-dialog-description" className="loading-info-text">
                        Please wait while your data is being processed. This can take up to a few
                        minutes.
                        <br/>
                        <br/>
                        Rough Time Estimate: <b> {calculateRoughTimeEstimate()}s </b>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
