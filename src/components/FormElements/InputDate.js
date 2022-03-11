import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { TextField } from '@material-ui/core';

const renderDateTimePicker = ({
    id,
    name,
    label,
    error,
    helperText,
    onBlur,
    onChange,
    value,
    }) => {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Date picker dialog"
                format="MM/dd/yyyy"
                value={value}
                format="dd/MM/yyyy"
                error={error}
                name={name}
                label={label}
                helperText={helperText}
                onChange={onChange}
                onBlur={onBlur}
                native
                SelectProps={{ native: true }}
                variant="outlined"
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>

    );
};

export default renderDateTimePicker;