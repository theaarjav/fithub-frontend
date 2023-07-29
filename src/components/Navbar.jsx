import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Spinner from 'react-bootstrap/esm/Spinner';

export const NavbarApp = () => {
  const navigate = useNavigate();
  const [user, setuser] = useState([]);
  const [Log, setLog] = useState(false);
  const [profile, setprofile]=useState([]);
  const [Loading, setLoading] = useState(true)
  const getUser = async () => {
    const { data } = await axios.get("https://maestrohub-backend.onrender.com/api/user/you", {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
      }
    });
    setuser(data.user);
    // setLog(true);
    // console.log(data)
  }

  const getProfile = async () => {

    const { data } = await axios.get("https://maestrohub-backend.onrender.com/api/profile/me", {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
      }
    });
    setprofile(data.profile);
    // setLog(true);
    // console.log(data)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if(localStorage.getItem("maestrohub")){
        // console.log("YES")
        getUser();
        getProfile();
        setLog(true);
      }else setLog(false);
      setLoading(false)
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const handleLogOut=(e) => {
    e.preventDefault();
    localStorage.removeItem("maestrohub");
    setLog(false);
    navigate("/")
  }

  return (
    Loading?<Spinner/>:
    <Navbar sticky='top' bg="dark" data-bs-theme="dark"
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        height:"10vh"
      }}>
      <Container>
        <Navbar.Brand ><NavLink to="/" style={{
          textDecoration: "none",
          color: "white"
        }}><b><i class="fa-solid fa-person-running">F i t&nbsp; H u b</i></b></NavLink></Navbar.Brand>
        <Nav className="me-auto">
          <NavLink to="/users" style={{
            textDecoration: "none",
            color: "white",
            margin: "10px"
          }}>Users</NavLink>
          {/* </Nav>
        <Nav className="me-auto"> */}
          {Log &&
            <NavLink style={{
              textDecoration: "none",
              color: "white",
              margin: "10px"
            }} to="/editProfile" >Edit Profile</NavLink>}
          {Log &&
            <NavLink style={{
              textDecoration: "none",
              color: "white",
              margin: "10px"
            }} to="/feed" >Feed</NavLink>}
        </Nav>
        <Nav className='justify-content-end '>
          {!Log ?
            <>
              <Button className='m-2' variant='outline-primary' onClick={() => {
                // setLog(true);
                 navigate("/user/login") 
                 }}>
                Login
              </Button>{'            |               '}

              <Button className='m-2' variant='outline-light' onClick={() => { navigate("/user/register") }}>
                Register
              </Button>
            </> :
            <>
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              marginRight:"25px"
            }}>

              <Button variant='outline-danger' onClick={handleLogOut}>
                Logout
              </Button>
                </div>
              <div className="container" style={{
                borderLeft:"1px solid white",
                justifyContent:"center",
                alignItems:"center",
                // display:"flex",
                color:"wheat",
                fontSize:"6vh"
              }}>
              {/* <p color='white'>|</p> */}
              
              {user?<img src={`${user.avatar}`} height={'50vh'} width={'50vh'} style={{
                borderRadius:"50%",
                cursor:"pointer"
              }}alt=""  
               />:<></>}<DropdownButton
               as={ButtonGroup}
               key={''}
               id={`dropdown-variants`}
              //  drop={'start'}
               variant=''
              title={''}
           >
            <DropdownItem onClick={()=>navigate('/followers')}>View Followers</DropdownItem>
            <DropdownItem onClick={()=>navigate('/following')}>View Following</DropdownItem>
            <DropdownItem onClick={()=>navigate('/yourPosts')}>View my Posts</DropdownItem>
            <DropdownItem onClick={()=>navigate(`/users/${profile._id}`)}>View Profile</DropdownItem>
            <DropdownItem  onClick={handleLogOut}>Logout {''} <i className="fa-solid fa-right-from-bracket"></i></DropdownItem>
           </DropdownButton>
              </div>
            </>
          }
        </Nav>
        {/* <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link> */}
      </Container>
      {/* <Container>
            <Nav className="me-auto">
              <NavLink>Login</NavLink>
            </Nav>
      </Container> */}
    </Navbar>
  );
}