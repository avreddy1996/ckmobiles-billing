import React, {useEffect, useState} from "react";
import GoogleLogin from "react-google-login";
import {HashRouter as Router, Redirect} from 'react-router-dom'
import config from "../config";
import Styled from "styled-components"
import {Typography} from "antd";

const Wrapper = Styled.div`
width: 100%;
height: 100vh;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
`;
const Title = Styled.div`
margin: 30px 0 10px 0;
text-align:center;
font-size: 24px;
font-weight: 600;
`;

function Login() {
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const responseGoogle = (response) => {
    console.log(response);
    if(response.profileObj){
      try{
        debugger;
        const authorisedEmails = config.REACT_APP_AUTHORISED_EMAILS;
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
      <Wrapper>
        <Title>Welcome to Chaitanya Communication Billing Software</Title>
      <GoogleLogin
          clientId="61578438734-lgto0d73m13rjpo77b0r8copjednck0o.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
      />
      {error && <Typography.Text type={"danger"}>{error}</Typography.Text>}
      </Wrapper>
  )
}

export default Login;