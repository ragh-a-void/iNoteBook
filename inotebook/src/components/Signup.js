import {React, useState, useContext} from 'react'
import { useHistory } from 'react-router-dom';
import noteContext from '../context/notes/noteContext';

export default function Signup() {
    const context = useContext(noteContext);
    const {url, showAlrtState} = context;
    
    let history = useHistory();

    const [credentials, setCredentials] = useState({name:"", email:"", password:"", cpassword:""});

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]:e.target.value})
    }

    const handleSignUp = async(e)=>{
        e.preventDefault();
        if(credentials.cpassword.localeCompare(credentials.password)!==0){
            showAlrtState("Warning", "Passwords do not match");
            // alert("Passwords do not match");
            return;
        }
        const response = await fetch(`${url}/api/auth/addUser`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({name:credentials.name, email:credentials.email, password:credentials.password})
        });
        const res = await response.json();
        console.log(res);
        if(res.success){
            localStorage.setItem('iNotebookToken', res.authToken);
            history.push("/");
        }
        else{
            showAlrtState("Warning", typeof res.errors === 'string'? res.errors:res.errors[0].msg);
            // alert(typeof res.errors === 'string'? res.errors:res.errors[0].msg);
        }
    }

    return (
        <div className='container'>
            <h1>SignUp</h1>
            <form onSubmit={handleSignUp}>
            <div className="mb-3">
                <label htmlFor="name">Name</label>
                <input type="name" className="form-control my-1" id="name" onChange={onChange} name="name" aria-describedby="nameHelp" placeholder="Enter name" minLength={3} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control my-1" id="email" onChange={onChange} name="email" aria-describedby="emailHelp" placeholder="Enter email" required/>
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control my-1" id="password" onChange={onChange} name="password" placeholder="Password" required minLength={5}/>
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword">Confirm Password</label>
                <input type="password" className="form-control my-1" id="cpassword" onChange={onChange} name="cpassword" placeholder="Password" required minLength={5}/>
            </div>
            <button type="submit" className="btn btn-primary my-2">Register</button>
            </form>
        </div>
    )
}
