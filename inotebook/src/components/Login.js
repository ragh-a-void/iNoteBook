import {React, useState, useContext} from 'react'
import { useHistory } from 'react-router-dom';
import noteContext from '../context/notes/noteContext';

export default function Login() {
    const context = useContext(noteContext);
    const {url, showAlrtState} = context;
    
    let history = useHistory();

    const [credentials, setCredentials] = useState({email:"", password:""});

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]:e.target.value})
    }

    const handleLogin = async(e)=>{
        e.preventDefault();
        const response = await fetch(`${url}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:credentials.email, password:credentials.password})
          });
          const res = await response.json();
        //   console.log(res);
          if(res.success){
              localStorage.setItem('iNotebookToken', res.authToken);
              history.push("/");
          }
          else{
              showAlrtState("Warning", typeof res.errors === 'string'? res.errors:res.errors[0].msg);
            //   alert(typeof res.errors === 'string'? res.errors:res.errors[0].msg);
          }
    }

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
            <div className="mb-3">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control my-1" id="email" onChange={onChange} name="email" aria-describedby="emailHelp" placeholder="Enter email" required/>
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control my-1" id="password" onChange={onChange} name="password" placeholder="Password" required/>
            </div>
            <button type="submit" className="btn btn-primary my-2">Log In</button>
            </form>
        </div>
    )
}
