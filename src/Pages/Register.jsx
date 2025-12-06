import React, { use, useState } from 'react';

import { Link, Navigate, useNavigate } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import { LuEyeClosed } from 'react-icons/lu';

const Registration = () => {
     const {createUser, setUser, signInWithGoogle, updateUserProfile} = use(AuthContext);
     const [nameError, setNameError] = useState('');
     const [success, setSuccess] = useState(false);
     const [error, setError] = useState('');
  const [showPass, setShoePass] = useState(false)
const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

    const handleSubmit = (e) =>{
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const name = e.target.name.value;
        const photo = e.target.photo.value;
        const terms = e.target.terms.checked
        //console.log(email, password);

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]).{6,}$/;

         if(!passwordPattern.test(password)){
          setError('Passowerd must be contain at least 6 characters long, include one uppercase, one lowercase and special character')
          //toast.error('Passowerd must be contain at least 6 characters long, include one uppercase, one lowercase and special character')
          return
         }

        if(name.length < 5){
            setNameError('Name Should be more then 5 character');
            return;
        }
        else{
            setNameError('')
        };
        
        setError(null);
         setSuccess(false);

         if(!terms){
          //toast.error('Please accept our terms and condition.');
          return;
         }

        createUser(email, password, terms)
        .then(result =>{
          const user = result.user;
          setSuccess(true)
          e.target.reset()
            //console.log(result.user);
             return updateUserProfile()
        .then(() => {
          setUser({ ...user, displayName: name, photoURL: photo });
          setSuccess(true);
          setError('');
          e.target.reset();
          //toast.success("Sign up successfull")
           navigate(from, {replace:true});
        });
      })
         .catch((error) => {
            console.log(error);
            setError(error.message);
            setSuccess(false)
          });
    }

    const handlePasswordShow = e =>{
      e.preventDefault();
      setShoePass(!showPass)
    }
        const handleGoogleSignIn = () =>{
         signInWithGoogle()
         .then(() => {
          //toast.success("Sign up successfull")
            //console.log(result.user);
            navigate(from, {replace:true})
            
         })
         .catch(err => {
            console.log(err);
            //toast.error(err.message)
         })
    }
    
   
    return (
      <div>
       <div><title>WarmPaws Register</title></div>
        <div className="hero base-200 min-h-screen">
  <div className="hero-content flex-col">
    <div className="text-center">
      <h1 className="text-5xl font-bold">Registration now!</h1>
      <p className="py-6">
        Welcome ! Sign up to keep your pets warm, safe, and stylish this winter.
      </p>
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
        <fieldset className="fieldset ">
             <label className="label">Name</label>
            <input
              name="name"
              type="text"
              className="input"
              placeholder="Name"
              required
            />

            {nameError && <p className="text-xs text-error">{nameError}</p>}

            {/* Photo URl  */}
            <label className="label">Photo URl </label>
            <input
              name="photo"
              type="text"
              className="input"
              placeholder="Photo URl"
              required
            />

          <label className="label">Email</label>
          <input name='email' type="email" className="input" placeholder="Email" />
          <label className="label">Password</label>
         <div className='relative'>
          <input name='password' type={showPass ? 'text' : "password"} className="input" placeholder="Password" />
          <button onClick={handlePasswordShow} className='text-2xl top-2 text-center absolute z-10 right-5'>{showPass ? <FaEye></FaEye> : <LuEyeClosed></LuEyeClosed>}</button>
          </div>
         <div>
            <label className="label">
         <input name='terms' type="checkbox" className="checkbox" />
        Accept our terms and condition
        </label>
           </div>

          {
            success && <p className='text-green-500'>Account Crteated Sussessfully</p>
          }
           {
          error && <p className='text-red-500'>{error.message}! provide a valid email or passowerd</p>  
        }
          <button className="btn btn-success text-white mt-4">Register</button>

          <button type='button' onClick={handleGoogleSignIn} className="btn bg-white text-black border-[#e5e5e5]">
  <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
  Login with Google
</button>

          <p>Already have an account ? Please <Link className='text-amber-700' to='/login'>Sign in</Link></p>
        </fieldset>
        </form>
      </div>
    </div>
  </div>
    </div>
      </div>
    );
};

export default Registration;