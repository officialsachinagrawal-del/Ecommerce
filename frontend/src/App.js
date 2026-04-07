import './App.css';
import Header from './components/Layout/Header';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Layout/Footer';
import About from './components/Layout/About';
import Contact from './components/Layout/Contact';
import Home from './components/Home';
import ProductDetails from './components/ProductDetails';
import Allproducts from './components/Allproducts';
import Search from './components/Layout/Search';
import Login from './components/User/login';
import Signup from './components/User/signup';
import { useEffect } from 'react';
import {loadUser} from './actions/userAction'
import store from './redux/store'
import { useSelector } from 'react-redux';
import Account from './components/User/account';
import UserUpdateProfile from './components/User/UserUpdateProfile';
import Cart from './components/Cart';
import Shipping from './components/Shipping';
import Confirmorder from './components/Confirmorder';
import Payment from './components/Payment';
import Successorder from './components/Successorder';
import Myorder from './components/Order/Myorder';
import Orderdetails from './components/Order/Orderdetails';
import Dashboard from './components/Admin/Dashboard';
import Productlist from './components/Admin/Productlist';
import Newproduct from './components/Admin/Newproduct';
import Updateproduct from './components/Admin/Updateproduct';

function App() {

  
const {isAuthenticated,user } = useSelector(state => state.user)


  useEffect(() => {
    store.dispatch(loadUser())

  }, [])
 
  return (
    <div className="">
       <Router>
         <Header  isAuthenticated={isAuthenticated}  user={user} />

         


          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/product/:id" element={<ProductDetails/>}/>
            <Route path="/products" element={<Allproducts/>}/>
            <Route path="/search" element={<Search/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/login" element={<Login/>}/>
            
            <Route path="/signup" element={<Signup/>}/>

            <Route
              path="/account"
              element={isAuthenticated ? <Account/> : <Navigate to="/login?redirect=account" replace />}
            />
            <Route
              path="/me/update"
              element={isAuthenticated ? <UserUpdateProfile user={user} /> : <Navigate to="/login?redirect=me/update" replace />}
            />

            <Route path="/cart" element={<Cart/>}/>

            <Route
              path="/shipping"
              element={isAuthenticated ? <Shipping /> : <Navigate to="/login?redirect=shipping" replace />}
            />

            <Route
              path="/order/confirm"
              element={isAuthenticated ? <Confirmorder/> : <Navigate to="/login?redirect=order/confirm" replace />}
            />


            <Route
              path="/payment"
              element={
                isAuthenticated
                  ? <Payment/>
                  : <Navigate to="/login?redirect=payment" replace />
              }
            />

            <Route
              path="/success"
              element={isAuthenticated ? <Successorder/> : <Navigate to="/login?redirect=success" replace />}
            />

            <Route
              path="/orders"
              element={isAuthenticated ? <Myorder/> : <Navigate to="/login?redirect=orders" replace />}
            />

            <Route
              path="/orders/:id"
              element={isAuthenticated ? <Orderdetails/> : <Navigate to="/login?redirect=orders" replace />}
            />

            <Route
              path="/dashboard"
              element={isAuthenticated && user?.role === 'admin' ? <Dashboard/> : <Navigate to="/login" replace />}
            />

            <Route
              path="/admin/products"
              element={isAuthenticated && user?.role === 'admin' ? <Productlist/> : <Navigate to="/login" replace />}
            />

            <Route
              path="/admin/product"
              element={isAuthenticated && user?.role === 'admin' ? <Newproduct/> : <Navigate to="/login" replace />}
            />

            <Route
              path="/admin/product/:id"
              element={isAuthenticated && user?.role === 'admin' ? <Updateproduct/> : <Navigate to="/login" replace />}
            />


          </Routes>
        <Footer/>
       </Router>

    </div>
  );
}

export default App