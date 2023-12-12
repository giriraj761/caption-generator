import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"
import '../login.css';
import quepng from '../background/question.png';

const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform login logic here

    try {
      const url = `http://localhost:8000/signin`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: user.email, password: user.password })
      })

      const json = await response.json();
      console.log(json);
      if (json.success === "true") {
        // alert('Successfull');
        // Save the auth token and redirect
        localStorage.setItem('token', json.token);
        console.log(user);
        navigate('/upload'); // Navigate to upload page after successful login
      }
      else if (json.success === "false") {
        alert('invalid credential');
      }
    } catch (error) {
        console.log(error);
    }

  };

  return (
    <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h3 id="logo">Log In</h3>
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              placeholder="Type in your email.."
              autocomplete="off"
              onChange={handleChange}
              required
            />
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              placeholder="Enter your password.." 
              autocomplete="off"
              onChange={handleChange}
              required
            />
          <button type="submit" className='btn'>Login</button>
          <Link to='/register' className='register'>New User?</Link>
        </form>
      <img className="login-image" src={quepng} alt="Cat" />
    </div>
  );
};

export default Login;
