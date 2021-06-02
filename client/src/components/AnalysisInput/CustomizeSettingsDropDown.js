/**
 * Renders the mini navbar pressent on the /analysis-results page, allowing switch between
 * individual and group results. Mantains own state, but also yields callback to parent
 * component once a page switch has been requested (i.e., Individual to Group).
 *
 * @summary Mini navbar on result page.
 * @author Amrit Kaur Singh
 */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import { FaInfoCircle } from "react-icons/fa";

import "../../css/CustomizeSettingsDropDown.css";

const SELECT_ALL_OPTION = "Select All";

export default function CustomizeSettingsDropDown(props) {

    // adds custom styling to material ui components 
    const useStyles = makeStyles((theme) => ({
        // style to choose all dropdowns
        formControl: {
            margin: theme.spacing(1),
            backgroundColor: "#C4C4C4",
            border: "1px solid black",
            borderRadius: "5px",

            // scolling enabled once maximum height is reached
            maxHeight: "100px",
            overflowY: "scroll",
        },
        // style to chips shown once item has been selected
        chips: {
            display: "flex",
            flexWrap: "wrap",
        },
        chip: {
            margin: 2,
        },
        noLabel: {
            marginTop: theme.spacing(3),
        },
        // distinguish items that have been chosen/vs not chosen on dropdown 
        select: {
            "&:before": {
                borderColor: "#004970",
            },
            "&:after": {
                borderColor: "#004970",
            },
        },
        icon: {
            fill: "black",
        },
    }));

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const classes = useStyles();
    // track all dropdown options chosen by user 
    const [chosenDropdownOptions, setchosenDropdownOptions] = React.useState([]);
    // track if checkbox has been clicked
    const [noneCheckbox, setNoneCheckbox] = React.useState(false);

    // handles changes made to dropdown 
    const handleChange = (event) => {
        // handles case where select all option is chosen
        if (event.target.value.includes(SELECT_ALL_OPTION)) {
            const allOptions = props.retrieveAllOptions();

            setchosenDropdownOptions(allOptions);
            props.callback(allOptions, noneCheckbox);
        // general case 
        } else {
            setchosenDropdownOptions(event.target.value);
            props.callback(event.target.value, noneCheckbox);
        }
    };

    const handleCheckboxChange = (event) => {
        // checked, then clear out any dropdown options chosen
        if (event.target.checked) {
            setchosenDropdownOptions([]);
            setNoneCheckbox(event.target.checked);
            props.callback([], event.target.checked);
            // unchecked
        } else {
            setNoneCheckbox(event.target.checked);
            props.callback(chosenDropdownOptions, event.target.checked);
        }
    };

    return (
        <div className="Dropdown-Container">
            {/* Title + Info Icon */}
            <p className="Dropdown-Title">
                {props.title}&nbsp;
                <Tooltip title={props.info} arrow>
                    <div>
                        <FaInfoCircle />
                    </div>
                </Tooltip>
            </p>
            {/* Dropdown of choices */}
            <FormControl className={`${classes.formControl} Dropdown-Form`}>
                {/* Default placeholder text if no option is chosen */}
                <InputLabel variant="filled" style={{ color: "black" }}>
                    Select Options
                </InputLabel>
                <Select
                    className={classes.select}
                    multiple
                    inputProps={{
                        classes: {
                            icon: classes.icon,
                        },
                    }}
                    disabled={noneCheckbox}
                    value={chosenDropdownOptions}
                    onChange={handleChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selected) => (
                        <div className={classes.chips}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} className={classes.chip} />
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {/* Select All Button */}
                    <MenuItem value={SELECT_ALL_OPTION}> Select All</MenuItem>
                    {/* Rest of dropdown choices  */}
                    {props.children}
                </Select>
            </FormControl>
            {/* Checkbox  */}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={noneCheckbox}
                        onChange={handleCheckboxChange}
                        style={{
                            color: "#004970",
                        }}
                    />
                }
                label="I don’t want this at all"
            />
        </div>
    );
}
