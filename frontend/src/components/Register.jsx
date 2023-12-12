import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import search from '../background/search1.png';
import '../login.css'

const Register = () => {

    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
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
        // Perform form submission or API call here

        try {
            const url = "http://localhost:8000/register";
            const response = await fetch(url, {
              method: "POST",
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify(user)
            })
      
            const json = await response.json();     // the res of auth.js will return here
            console.log(json);
            // console.log(response);
      
            if(json.success === "true"){
                window.alert("User registered Successfully. Click okay to Login..");
                navigate("/login");     // navigate after clicking okay
      
                
            }
            else{
              window.alert(json.error);
            }
          } catch (error) {
            console.log("Error itthe");
          }
    };

    return (
        <div className="login-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
            <h3 id="logo">Sign Up</h3>
                    <label for="firstname">First Name</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={user.firstname}
                        placeholder="Type in your firstname.."
                        autocomplete="off"
                        onChange={handleChange}
                        required
                    />
                    <label for="lastname">Last Name</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={user.lastname}
                        placeholder="Type in your lastname.."
                        autocomplete="off"
                        onChange={handleChange}
                        required
                    />
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
                        placeholder="Type in your password.."
                        autocomplete="off"
                        onChange={handleChange}
                        required
                    />
                <button type="submit" className="btn">Sign Up</button>
            </form>
            <img className="login-image" style={{transform: "scalex(-1)", paddingLeft:"34px"}} src={search} alt="Cat" />
        </div>
    )
}

export default Register