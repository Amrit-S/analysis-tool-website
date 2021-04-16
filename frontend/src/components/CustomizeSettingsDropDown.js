/**
 * Renders the mini navbar pressent on the /analysis-results page, allowing switch between 
 * individual and group results. Mantains own state, but also yields callback to parent
 * component once a page switch has been requested (i.e., Individual to Group).
 * 
 * @summary     Mini navbar on result page. 
 */
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import { FaInfoCircle } from 'react-icons/fa';
import "../css/CustomizeSettingsDropDown.css";

export default function CustomizeSettingsDropDown(props) {

        const useStyles = makeStyles((theme) => ({
            formControl: {
              margin: theme.spacing(1),
              backgroundColor: "#C4C4C4",
              border: "1px solid black",
              borderRadius: "5px"
            },
            chips: {
              display: 'flex',
              flexWrap: 'wrap',
            },
            chip: {
              margin: 2,
            },
            noLabel: {
              marginTop: theme.spacing(3),
            },
            select: {
                '&:before': {
                    borderColor: "#004970",
                },
                '&:after': {
                    borderColor: "#004970",
                }
                
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
        const theme = useTheme();
        const [chosenDropdownOptions, setchosenDropdownOptions] = React.useState([]);
        const [noneCheckbox, setNoneCheckbox] = React.useState(false);

        function getStyles(name, chosenDropdownOptions, theme) {
            return {
              fontWeight:
                chosenDropdownOptions.indexOf(name) === -1
                  ? theme.typography.fontWeightRegular
                  : theme.typography.fontWeightMedium,
            };
        }
    
        const handleChange = (event) => {
            setchosenDropdownOptions(event.target.value);
            props.callback(event.target.value, noneCheckbox);
        };

        const handleCheckboxChange = (event) => {
            // checked, then clear out any dropdown options chosen 
            if(event.target.checked){
                setchosenDropdownOptions([]);
                setNoneCheckbox(event.target.checked);
                props.callback([], event.target.checked);
            // unchecked
            } else{
                setNoneCheckbox(event.target.checked);
                props.callback(chosenDropdownOptions, event.target.checked);
            }
        }

      return (

          <div className="Dropdown-Container">
            <p className="Dropdown-Title"> 
              {props.title}&nbsp;  
              <Tooltip title={props.info} arrow>
                <div>
                <FaInfoCircle />
                </div>
              </Tooltip>
            </p>
            {/* <Tooltip > <FaInfoCircle/> </Tooltip> */}
            <FormControl className={`${classes.formControl} Dropdown-Form`}>
                <InputLabel variant='filled' style={{color: "black"}}>Select All</InputLabel>
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
                        <Chip key={value} label={value} className={classes.chip}/>
                    ))}
                    </div>
                )}
                MenuProps={MenuProps}
                >
                {props.options.map((name) => (
                    <MenuItem key={name} value={name} style={getStyles(name, chosenDropdownOptions, theme)}>
                    {name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            <FormControlLabel
                control={
                <Checkbox
                    checked={noneCheckbox}
                    onChange={handleCheckboxChange}
                    style ={{
                        color: "#004970",
                      }}
                />
                }
                label="I don’t want this at all"
            />
          </div>

      )
  };