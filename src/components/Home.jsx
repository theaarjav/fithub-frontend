import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Carousel from 'react-bootstrap/Carousel';
import CarouselItem from 'react-bootstrap/esm/CarouselItem';
export const Home = () => {
    const navigate = useNavigate();
    const [allUsers, setallUsers] = useState([])
    const getAllUsers = async () => {
        let { data } = await axios.get("https://maestrohub-backend.onrender.com/api/profile/allusers")
        setallUsers(data.allprofiles);
        console.log(allUsers);
    }
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("maestrohub");
        navigate("/")
    }


    return (





        <Carousel style={{
            backgroundColor:'black'
        }}>
            <Carousel.Item>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "90vh",
                    width: "100vw",
                    // backgroundColor:'black'
                    
                    // objectFit:"fill"
                    
                }}>
                    
                    {localStorage.getItem("maestrohub") ?
                        <div style={{
                            height:'100%',
                            width:'69%',
                            display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                            backgroundImage: "url('https://img.freepik.com/free-photo/young-happy-sportswoman-warming-up-listening-music-earphones-during-sports-training-outdoors_637285-5549.jpg?w=1060&t=st=1689703054~exp=1689703654~hmac=8950eda4495090f59d5cccdf571f80163656b7539c47b33fdba3dd5ccba9c643')",
                            objectFit:'fill'
                        }}>

                        <Button variant="danger" onClick={handleLogout}>Logout</Button>
                        </div>
                        :
                        <div style={{
                            height:'100%',
                            width:'69%',
                            display: "flex",
                            flexDirection:"column",
                    justifyContent: "center",
                    alignItems: "center",

                            backgroundImage: "url('https://img.freepik.com/free-photo/young-happy-sportswoman-warming-up-listening-music-earphones-during-sports-training-outdoors_637285-5549.jpg?w=1060&t=st=1689703054~exp=1689703654~hmac=8950eda4495090f59d5cccdf571f80163656b7539c47b33fdba3dd5ccba9c643')",
                            objectFit:'fill'
                        }}>
                            <div className='container' style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>

                                <Button variant="primary m-3" onClick={() => { navigate("/user/register") }}>Register</Button>
                                <Button variant="secondary m-3" onClick={() => { navigate("/user/login") }}>Log In</Button>
                            </div>
                            <h4 style={{
                                color:"black"
                            }}>Sign In to share your views with fellow Fitness Fanatics</h4>
                        </div>
                    }
                </div>
                <Carousel.Caption>

                    {
                        // localStorage.getItem("maestrohub") ?
                        // <div style={{
                        //     display:"flex",
                        //     justifyContent:"center",
                        //     alignItems:"center"
                        // }}>
                        //     <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                        //     {/* <p>Sign In to share your views with fellow users</p> */}
                        // </div> :

                        // <div className='container'>

                        //     <Button variant="primary m-3" onClick={() => { navigate("/user/register") }}>Register</Button>
                        //     <Button variant="secondary m-3" onClick={() => { navigate("/user/login") }}>Log In</Button>
                        //     <p>Sign In to share your views with fellow members</p>
                        // </div>
                    }



                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div className="container" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "90vh",
                    width: "70%",
                    // backgroundColor:'black',
                    backgroundImage: 'url("https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
                    color: "white",
                    fontWeight: "bold"
                }}>
                    <h4 className='m-2'>Check out Fitness lovers who signed up with us:</h4>
                    <Button variant='secondary' onClick={() => navigate('/users')}>Users</Button>
                </div>


            </Carousel.Item>
            {/* <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://www.realmadrid.com/StaticFiles/RealMadridResponsive/images/header_logo.svg"
                    alt="Third slide"
                />

                <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                </Carousel.Caption>
            </Carousel.Item> */}
        </Carousel>







    )
}
