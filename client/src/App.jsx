import { Routes, Route } from 'react-router-dom';
import './App.css';
import IndexPage from './Pages/IndexPages';
import LoginPage from './Pages/LoginPage';
import AccountPage from './Pages/AccountPage';
import Layout from './Layout';
import RegisterPage from './Pages/RegisterPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext';

axios.defaults.baseURL = 'http://127.0.0.1:4000';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/:subpage?" element={<AccountPage />} />
          <Route path="/account/:subpage/:action" element={<AccountPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
