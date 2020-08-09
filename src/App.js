import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";
import 'antd/dist/antd.css';
import NewInvoice from "./components/NewInvoice";
import {HashRouter as Router, Switch, Route, Link} from "react-router-dom";
import {Button} from "antd";
import InvoiceList from "./components/InvoiceList";
import Styled from "styled-components";
import {FileAddOutlined, OrderedListOutlined} from "@ant-design/icons";
import AutoGenerate from "./components/AutoGenerate";

const ButtonContainer = Styled.div`
margin: ${props => props.active?'100px 0':'30px 0 20px 0'};
justify-content: center;
display: flex;
& a{
margin: 10px;
}
`;
function App({match}) {
  const [loggedIn,setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  useEffect(()=>{
    try{
      const user = JSON.parse(localStorage.getItem('profileObj'));
      setUser(user);
      setLoggedIn(!!user.email);
      setLoading(false);
    }catch (e) {
      setLoggedIn(false);
      setLoading(false);
    }
  },[]);

  const handleLogout = ()=>{
    localStorage.removeItem('profileObj');
    setLoggedIn(false);
  };
  if(!loading && !loggedIn){
    return <Redirect to={'/login'} />
  }

  return (
    <div className="App">
      <Header user={user} logout={handleLogout} title={match.params.id === 'cv'?'CV Agencies':'Chaithanya Communications'}/>
      <ButtonContainer active={match.isExact}>
        <Button type={"primary"} href={`#/${match.params.id}/create`} icon={<FileAddOutlined/>} >New Invoice</Button>
        <Button type={"primary"} href={`#/${match.params.id}/list`} icon={<OrderedListOutlined />}>View Invoices List</Button>
        <Button type={"primary"} href={`#/${match.params.id}/auto`} icon={<OrderedListOutlined />}>Auto Generate Bills</Button>
      </ButtonContainer>
      <Router>
        <Switch>
          <Route path={'/:id/create'} component={NewInvoice} />
          <Route path={'/:id/list'} component={InvoiceList} />
          <Route path={'/:id/auto'} component={AutoGenerate} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
