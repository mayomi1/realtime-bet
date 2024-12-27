import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import {AuthButton} from "./ui/AuthButton.tsx";
import ErrorDisplay from "./ui/ErrorDIsplay.tsx";

export const LoginForm: React.FC = () => {
  const [isLogin, setLogin] = useState(true)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('')
  const { login, register, isLoadingAuth, authError, formErrors } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register(username, email, password);
    }

  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6" data-testid="login-header">{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit} role="form">
        {
          !isLogin && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
              <input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )
        }
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input
            id="password"
            min={4}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <ErrorDisplay
          error={authError}
          formErrors={formErrors}
        />

        <AuthButton
          isLoading={isLoadingAuth}
          loadingText="Loading..."
          className="mt-4"
        >
          {isLogin ? 'Login' : 'Register'}
        </AuthButton>
      </form>

      {
        isLogin ?
          <div className="mt-5">Don't have account? <span className="text-blue-500 cursor-pointer" data-testid="click-register-switch" onClick={() => setLogin(false)}>Register</span></div> :
          <div className="mt-5">Already have account? <span className="text-blue-500 cursor-pointer" data-testid="click-login-switch" onClick={() => setLogin(true)}>Login</span></div>
      }
    </div>
  );
};
