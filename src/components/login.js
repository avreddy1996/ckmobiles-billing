import React, {useEffect, useState} from "react";
import GoogleLogin from "react-google-login";
import {HashRouter as Router, Redirect} from 'react-router-dom'

function Login() {
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const responseGoogle = (response) => {
    console.log(response);
    if(response.profileObj){
      try{
        debugger;
        const authorisedEmails = process.env.REACT_APP_AUTHORISED_EMAILS && JSON.parse(process.env.REACT_APP_AUTHORISED_EMAILS);
        if(typeof authorisedEmails === 'object'){
          if(authorisedEmails.indexOf(response.profileObj.email) !== -1){
            localStorage.setItem('profileObj', JSON.stringify(response.profileObj));
            setLoggedIn(true);
            setLoading(false);
          }else{
            setError('Unauthorised Person');
          }
        }else{
          setError('Unable to sign in... Please try again');
        }
      }catch (e) {
        setError('Unable to sign in... Please try again');
        console.log(e)
      }
    }else{
      setError('Unable to sign in... Please try again')
    }
  };
  useEffect(()=>{
    try{
      const user = JSON.parse(localStorage.getItem('profileObj'));
      setLoggedIn(!!user.email);
      setLoading(false);
    }catch (e) {
      setLoggedIn(false);
      setLoading(false);
    }
  },[]);
  if(!loading && loggedIn){
    return <Router><Redirect to={'/'} /></Router>
  }
  return(
      <GoogleLogin
          clientId="61578438734-lgto0d73m13rjpo77b0r8copjednck0o.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
      />
  )
}

export default Login;