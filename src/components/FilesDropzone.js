import React, {
  useState,
  useCallback
} from 'react';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MoreIcon from '@material-ui/icons/MoreVert';
import bytesToSize from '../../src/utils/bytesToSize';
const useStyles = makeStyles((theme) => ({
  root: {},
  dropZone: {
    border: `1px dashed ${theme.palette.divider}`,
    padding: theme.spacing(6),
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      opacity: 0.5,
      cursor: 'pointer'
    }
  },
  dragActive: {
    backgroundColor: theme.palette.action.active,
    opacity: 0.5
  },
  image: {
    width: 130
  },
  info: {
    marginTop: theme.spacing(1)
  },
  list: {
    maxHeight: 320
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}));

const FilesDropzone = ({ className,onChange, ...rest }) => {
  const classes = useStyles();
  const [files, setFiles] = useState([]);

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles].concat(acceptedFiles));
  }, []);

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop
  });

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <div
        className={clsx({
          [classes.dropZone]: true,
          [classes.dragActive]: isDragActive
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()}  />
        <div>
          <img
            alt="Imagen"
            className={classes.image}
            src="/assets/img/1.png"
          />
        </div>
        <div>
          <Typography
            gutterBottom
            variant="h3"
          >
            Selecciona imagen
          </Typography>
          <Box mt={2}>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Suelta los archivos aquí o haz clic en

              {' '}
              <Link underline="always">aqui</Link>
              {' '}
             para acceder  en tu máquina
            </Typography>
          </Box>
        </div>
      </div>
      {files.length > 0 && (
        <>
          <PerfectScrollbar options={{ suppressScrollX: true }}>
            <List className={classes.list}>
              {files.map((file, i) => (
                <ListItem
                  divider={i < files.length - 1}
                  key={i}
                >
                  <ListItemIcon>
                    <FileCopyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{ variant: 'h5' }}
                    secondary={bytesToSize(file.size)}
                  />
            
                </ListItem>
              ))}
            </List>
          </PerfectScrollbar>
          <div className={classes.actions}>
            <Button
              onClick={handleRemoveAll}
              size="small"
            >
              Remove all
            </Button>
            <Button
              color="secondary"
              size="small"
              variant="contained"
            >
              Upload files
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

FilesDropzone.propTypes = {
  className: PropTypes.string
};

export default FilesDropzone;
