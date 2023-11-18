import './App.css';
import {createBrowserRouter, Route, createRoutesFromElements, RouterProvider} from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Logout from './components/auth/Logout';
import Error from './components/Error';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route index element={<Home />}/>
      <Route path='/profile' element={<Profile />}/>
      <Route path='/register' element={<Register />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/logout' element={<Logout />}/>
      <Route path='*' element={<Error />}/>
    </Route>
  )
)

function App() { 
  return (
    <RouterProvider router={router} />
  );
}

export default App;
