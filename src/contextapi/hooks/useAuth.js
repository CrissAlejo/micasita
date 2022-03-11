import { useContext } from 'react';
import AuthContext from './../contexts/AuthContextProd';

const useAuth = () => useContext(AuthContext);

export default useAuth;
