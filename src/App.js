import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Login from'./login.js';
import AuthCode from './AuthCode.jsx'
import Welcome from './mainPage.jsx';
import DashBoard from './dashboard.jsx';


function App() {
  return (
    <Router>
    <div>
        <Routes>
        <Route path="/authcode" element={<AuthCode/>} exact/>
        <Route  path='/' element={<Login/>}/>
        <Route path="/welcome" element={<Welcome/>}/>
        <Route path="/dashboard" element={<DashBoard/>}/>
        </Routes>
    </div>
    </Router>
    
  );
}



export default App;
