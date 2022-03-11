import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import PropTypes from "prop-types";
import InputLabel from "@material-ui/core/InputLabel";

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 2,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);
export default function CustomSelect(props) {
  const { data, inputProps,title } = props;
  let newInputProps = {
    maxLength:
      inputProps && inputProps.maxLength ? inputProps.maxLength : undefined,
    minLength:
      inputProps && inputProps.minLength ? inputProps.minLength : undefined,
    step: inputProps && inputProps.step ? inputProps.step : undefined,
  };  

  return (
    <FormControl>
      <InputLabel htmlFor="demo-customized-select-native">{title}</InputLabel>

      <NativeSelect
        id="demo-customized-select-native"
        {...inputProps}
        inputProps={newInputProps}
        input={<BootstrapInput />}
      >
        {data.map((contractItem, index) => {
          return (
            <option key={index} value={contractItem.nombre}>
              {contractItem.Nombre}
              {contractItem.nombre}
            </option>           
          );
        })}
      </NativeSelect>
    </FormControl>
  );
}

CustomSelect.propTypes = {
  inputProps: PropTypes.object,
  data: PropTypes.array,
  title:PropTypes.string,
};
