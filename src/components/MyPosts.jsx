import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/esm/Spinner';
export const MyPosts = () => {
    const navigate = useNavigate()
    const [user, setuser] = useState([])
    const [allusers, setallusers] = useState([])
    const [posts, setposts] = useState([]);
    const [Loading, setLoading] = useState(true)
    const getUser = async (e) => {
        let { data, status } = await axios.get("https://maestrohub-backend.onrender.com/api/user/you", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })

        if (status === 200) setuser(data.user);


        // console.log(user)
    }
    
    const getProfiles = async () => {
        let allprofile = await axios.get("https://maestrohub-backend.onrender.com/api/profile/allusers");
        setallusers(allprofile.data.allprofiles);
        // setLoading(false);
    }
    const getAllPosts = async (e) => {
        let { data, status } = await axios.get("https://maestrohub-backend.onrender.com/api/post/", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        if (status === 200) setposts(data.allPosts);
    }

    useEffect(() => {
        if (!localStorage.getItem("maestrohub")) {
            return navigate("/user/login");
        }
        getUser().then(() => { getAllPosts().then(() => { getProfiles(); }); })
        setLoading(false);
    }, [])

    

    


    const timeDiff = (curr, posted) => {
        var msperMin = 60 * 1000;
        var msperHr = 60 * msperMin;
        var msperDay = 24 * msperHr;
        var msperWeek = 7 * msperDay;
        var msperMonth = 30 * msperDay;
        var msperYear = 365 * msperDay;

        var diff = curr - posted;
        if (diff < msperMin) {
            return Math.round(diff / 1000) === 1 ? (Math.round(diff / 1000) + " second ago") : (Math.round(diff / 1000) + " seconds ago");
        } else if (diff < msperHr) {
            return Math.round(diff / msperMin) === 1 ? (Math.round(diff / msperMin) + " minute ago") : (Math.round(diff / msperMin) + " minutes ago");

        } else if (diff < msperDay) {
            return Math.round(diff / msperHr) === 1 ? (Math.round(diff / msperHr) + " hour ago") : (Math.round(diff / msperHr) + " hours ago");

        } else if (diff < msperWeek) {
            return Math.round(diff / msperDay) === 1 ? (Math.round(diff / msperDay) + " day ago") : (Math.round(diff / msperDay) + " days ago");

        } else if (diff < msperMonth) {
            return Math.round(diff / msperWeek) === 1 ? (Math.round(diff / msperWeek) + " week ago") : (Math.round(diff / msperWeek) + " weeks ago");

        } else if (diff < msperYear) {
            return Math.round(diff / msperMonth) === 1 ? (Math.round(diff / msperMonth) + " month ago") : (Math.round(diff / msperMonth) + " months ago");
        } else {
            return Math.round(diff / msperYear) === 1 ? (Math.round(diff / msperYear) + " year ago") : (Math.round(diff / msperYear) + " years ago");
        }

    }

    const handleDelete = async (postID) => {
        // e.preventDefault();
        let { data, status } = await axios.delete(`https://maestrohub-backend.onrender.com/api/post/${postID}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        if (status === 200) {
            Swal.fire(data.msg, "", "success");
            getAllPosts();
        } else {
            Swal.fire("Error", "", "error");
            navigate("/feed");
        }
    }

   
    return (
        Loading ? <div className='container' style={{
            display: "flex",
            padding: "5vh",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}>
    
            <Spinner />
    
          </div>:
        <div className='container p-2' style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center"
        }}>



            
            {
            
            posts.map(post => {
                
                return post.user._id===user._id?<Card className='m-3' style={{ width: '50rem' }} key={post._id}>
                    <Card.Title className='p-2' style={{
                        alignSelf: "center",
                        fontSize: "3.5vh"
                    }}>{post.title}</Card.Title>
                    <Card.Img variant="top"
                        //  src="https://www.realmadrid.com/StaticFiles/RealMadridResponsive/images/header_logo.svg"
                        src={`${post.image}`}
                        alt={`Image By ${post.user.name} regarding ${post.title}`}
                    />
                    <Card.Body>
                        <Card.Text className='p-2' style={{
                            fontSize: "2.5vh"
                        }}>
                            {post.description}

                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        
                        <div className="container row">

                            <ListGroup.Item className='col-3' style={{
                                textAlign: "center",
                            }}>

                                {post.likes.includes(user._id) ? <i className="fa-solid fa-heart" style={{
                                    cursor: "pointer",
                                    color: "red"
                                }} onClick={async () => {
                                    let { status } = await axios.put(`https://maestrohub-backend.onrender.com/api/post/likes/${post._id}`, {}, {
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
                                        }
                                    }

                                    );
                                    if (status === 200) getAllPosts();

                                }}></i> : <i className="fa-regular fa-heart" style={{
                                    cursor: "pointer"
                                }} onClick={async () => {
                                    let { status } = await axios.put(`https://maestrohub-backend.onrender.com/api/post/likes/${post._id}`, {}, {
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
                                        }
                                    });
                                    if (status === 200)
                                        getAllPosts();
                                }}></i>}{' '}<span style={{
                                    cursor: "pointer"
                                }} >{post.likes.length === 1 ? "1 Like" : `${post.likes.length} Likes`}</span>
                                <DropdownButton
                                    as={ButtonGroup}
                                    key={''}
                                    id={`dropdown-variants`}
                                    variant=''
                                    title={``}
                                >
                                    {post.likes.map((like) => {

                                        return allusers.map((profile) => {
                                            return profile.user._id === like ? <Dropdown.Item>
                                                <Card onClick={() => navigate(`/users/${profile._id}`)}>
                                                    <Card.Body style={{
                                                        fontWeight: "bold"
                                                    }}><img src={`${profile.user.avatar}`} height={"25vh"} width={"30vh"} alt={`${profile.user.name}'s avatar`}></img> {profile.user.name}</Card.Body>
                                                </Card>
                                            </Dropdown.Item> : <></>
                                        })
                                    })}
                                </DropdownButton>
                                
                            </ListGroup.Item>
                            <ListGroup.Item className='col-3' style={{
                                // display:"flex",
                                textAlign: "center",
                                // justifyContent: "center"
                            }}><i className="fa-regular fa-comment" style={{
                                cursor: "pointer"
                            }}></i> <span style={{cursor:'pointer'}} onClick={()=>navigate(`/p/${post._id}`)}>{post.comments.length === 1 ? "1 Comment" : `${post.comments.length} Comments` }</span></ListGroup.Item>
                            {post.user._id === user._id ? <ListGroup.Item className='col-6 justify-content-end'>
                                <Button variant='danger' onClick={handleDelete.bind(this, post._id)} style={{
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <i className="fa-solid fa-trash"></i> Delete Post
                                </Button>
                            </ListGroup.Item> : ""}
                        </div>
                    </ListGroup>
                    <Card.Body className='text-muted'>

                        {timeDiff(new Date(), new Date(post.createdAt))}
                    </Card.Body>
                </Card>:<></>
            })}

        </div>
    )
}
