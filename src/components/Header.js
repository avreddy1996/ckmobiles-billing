import React from "react";
import styled from "styled-components";
import {Tooltip, Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';

const StyledHeader = styled.header`
width: 100%;
padding: 16px;
display: flex;
align-items: center;
justify-content: space-between;
position: sticky;
top: 0;
background: #fff;
z-index: 1;
box-shadow: 0 0 10px 0 rgba(0,0,0,0.2);
& h5{
font-weight: 400;
font-size: 20px;
margin: 0;
flex: 1 1 70%;
}
`;
const UserDetails = styled.div`
display: flex;
align-items: center;
flex: 1 1;
& img{
width: 50px;
height: 50px;
border-radius: 25px;
}
`;
const Name = styled.span`
margin: 0 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 200px;
    white-space: nowrap;
    display: block;
`;
function Header({user, logout, title}) {
  return (
      <StyledHeader>
        <h5>
          <Link to={'/'}>{title}</Link>
        </h5>
        <UserDetails>
          <img src={user.imageUrl} alt={'avatar'} />
          <Name>{user.name}</Name>
          <Tooltip title="Logout">
            <Button danger shape="circle" icon={<PoweroffOutlined />} onClick={logout}/>
          </Tooltip>
        </UserDetails>
      </StyledHeader>
  )
}
export default Header