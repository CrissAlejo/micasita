import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));



export default function CustomArrayChips(props) {
  const {data} = props;
  const [chipData, setChipData] =  React.useState([])
  const classes = useStyles();
    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };
    

  return (
    
    <Paper component="ul" className={classes.root}>                 
      {data.map((contractItem, index) => {
        return (          
          <li key={index}>                   
            <Chip
              label={contractItem}
              className={classes.chip}
              onDelete={handleDelete(contractItem)} 
            />
          </li>
        );
      })}
    </Paper>
  );
}

CustomArrayChips.propTypes = {
data: PropTypes.array,
}