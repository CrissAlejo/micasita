import * as React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import useAuth from "../../../contextapi/hooks/useAuth";
import useSettings from "../../../contextapi/hooks/useSettings";

const ConjuntosSelect = () => {
  const { user } = useAuth();
  const [conjuntosid] = React.useState(user?.ConjuntoUid);
  const { conjuntose } = useSettings();
  const [seleccj, setSelectcj] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  React.useEffect(() => {
    handleLanguageMenuClose(conjuntosid[0]);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
  };
  const handleLanguageMenuClose = async (event) => {
    const conj = JSON.parse(event);
    setSelectcj(conj.nombre);
    await conjuntose({ idConjunto: conj.uid, Imagen: conj.Imagen });
    setAnchorEl(null);
  };
  if (conjuntosid) {
    return (
      <div>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          {seleccj}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClick={handleClose}
        >
          {conjuntosid.map((notificaicon) => (
            <MenuItem
              component="a"
              data-no-link="true"
              onClick={() => handleLanguageMenuClose(notificaicon)}
            >
              {JSON.parse(notificaicon).nombre}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
};

export default ConjuntosSelect;
