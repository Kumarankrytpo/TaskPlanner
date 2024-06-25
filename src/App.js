import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Login from'./login.js';
import AuthCode from './AuthCode.jsx'
import DashBoard from './dashboard.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx'


function App() {
  return (
    <Router>
    <div>
        <Routes>
        <Route element={<ProtectedRoute />}>
           <Route path="/authcode" element={<AuthCode/>} exact/>
           <Route path="/dashboard" element={<DashBoard/>}/>
        </Route>  
        <Route  path='/' element={<Login/>}/>
        </Routes>
    </div>
    </Router>
    
  );
}



export default App;
