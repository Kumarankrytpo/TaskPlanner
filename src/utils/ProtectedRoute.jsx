import {Outlet , Navigate} from 'react-router-dom';

const ProtectedRoute = ()=>{
    var user = null;
    if(sessionStorage.length===3){
        user = true;
    }
    return user ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;