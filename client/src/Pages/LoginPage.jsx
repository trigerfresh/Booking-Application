import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  const hEmail = (e) => {
    setEmail(e.target.value);
  };

  const hPassword = (e) => {
    setPassword(e.target.value);
  };

  async function handleLoginSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { email, password }, { withCredentials: true });
      console.log(response.data);
      alert('Login Successful');
      // Store the user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data); // Set user in context
      setRedirect(true);
    } catch (error) {
      console.error("Login Error:", error);
      alert('Login Failed. Please try again.');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form
          className="max-w-md mx-auto rounded-full rounded:md"
          onSubmit={handleLoginSubmit}
        >
          <input
            type="email"
            placeholder={'your@email.com'}
            value={email}
            onChange={hEmail}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={hPassword}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account?{' '}
            <Link className="underline text-black" to={'/register'}>
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
