import './App.css';
import Header from './components/Layout/Header';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <div className="">
      <Router>
        <Header isAuthenticated={isAuthenticated} user={user} />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Allproducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/me/update"
            element={
              <ProtectedRoute>
                <UserUpdateProfile user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shipping"
            element={
              <ProtectedRoute>
                <Shipping />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order/confirm"
            element={
              <ProtectedRoute>
                <Confirmorder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <Successorder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Myorder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <Orderdetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? <Dashboard /> : <Navigate to="/" replace />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? <Productlist /> : <Navigate to="/" replace />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/product"
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? <Newproduct /> : <Navigate to="/" replace />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/product/:id"
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? <Updateproduct /> : <Navigate to="/" replace />}
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App