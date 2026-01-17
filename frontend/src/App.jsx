
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/ProductList'
import CheckoutPage from './pages/CheckoutPage';
import PrivateRouter from './components/PrivateRouter';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
         <Route element={<PrivateRouter/>}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>
        <Footer />
    </Router>
    
  );
}

export default App;