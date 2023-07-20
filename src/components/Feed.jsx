import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/esm/Spinner';
import Badge from 'react-bootstrap/esm/Badge';

export const Feed = () => {
    const navigate = useNavigate()
    const [user, setuser] = useState([])
    const [allusers, setallusers] = useState([])
    const [posts, setposts] = useState([]);
    const [profile, setprofile] = useState([])
    const [isCreating, setIsCreating] = useState(false)
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
    const getProfile = async () => {
        let { data, status } = await axios.get("https://maestrohub-backend.onrender.com/api/profile/me", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        if (status === 200) setprofile(data.profile);
        // setLoading(false);
    }
    const getProfiles = async () => {
        let allprofile = await axios.get("https://maestrohub-backend.onrender.com/api/profile/allusers");
        setallusers(allprofile.data.allprofiles);
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
        getProfile();
        setLoading(false)
    }, [])

    const handleViewProfile = async (id) => {
        let { data, status } = await axios.get(`https://maestrohub-backend.onrender.com/api/profile/users/${id}`, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        let profile;
        if (status === 200) profile = data.profile._id;
        if (profile) {
            navigate(`/users/${profile}`)
        }
    }

    const [newpost, setnewpost] = useState({
        title: "",
        image: "",
        description: ""
    });
    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);


        setnewpost({
            ...newpost,
            image: base64.toString()
        })
    };
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (err) => {
                reject(err);
            };
        });
    };
    const handleChange = (e) => {
        setnewpost({ ...newpost, [e.target.name]: e.target.value })
    }

    const handleNewPostSubmit = async (e) => {
        if(newpost.title==="" || newpost.title.trim()===""){
            return Swal.fire("Title cannot be empty","","error")
        }
        let { data, status } = await axios.post("https://maestrohub-backend.onrender.com/api/post/new", newpost, {
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        });
        if (status === 200) {
            Swal.fire(data.msg, "", "success")
            getAllPosts();
        }
        else {
            Swal.fire(data.msg, status, "error")
            navigate("/feed");
        }
        setIsCreating(false);
    }


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

    function MyVerticallyCenteredModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Liked By:
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.likes.map((like) => {
                        return <div className='container' >
                            {allusers.map(profile => {
                                return <div >
                                    {profile.user._id === like ? <Card>
                                        <Card.Body style={{
                                            fontWeight: "bold"
                                        }}><img src={`${profile.user.avatar}`} height={"25vh"} width={"30vh"} alt={`${profile.user.name}'s avatar`}></img> {profile.user.name}</Card.Body>
                                    </Card> : ""}
                                </div>
                            })}
                        </div>
                    })}
                </Modal.Body>

            </Modal>
        );
    }
    const handleFollow = async (id) => {
        // console.log("HandleFollow")
        const { data, status } = await axios.put(`https://maestrohub-backend.onrender.com/api/profile/${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        if (status === 200) Swal.fire(data.msg, "", "info")
        // getUser();
        // setprofile(data.userprofile)
        getProfile();


    }

    const [modalShow, setModalShow] = useState(false)
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



            <div className='m-3'>

                {isCreating ? <div className="container">

                    <Card style={{ width: '50rem' }}>
                        <Card.Body>
                            <Card.Title>Create New Post</Card.Title>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Title</Form.Label>
                                <Form.Control name='title' type="text" placeholder="Title of the post" onChange={handleChange} />
                                <Form.Text className="text-muted">
                                    Tell others what's the post about
                                </Form.Text>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Photo/Image</Form.Label>
                                <Form.Control onChange={uploadImage} type="file" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Description</Form.Label>
                                <Form.Control name='description' type="text" placeholder="Describe what's on your mind" onChange={handleChange} />
                                <Form.Text className="text-muted">
                                    Caption for the Post
                                </Form.Text>
                            </Form.Group>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}>
                                <Button variant='primary' onClick={handleNewPostSubmit}>
                                    Create Post
                                </Button>
                                <Button variant='danger' onClick={() => { setIsCreating(false) }}>
                                    Close
                                </Button>

                            </div>
                        </Card.Body>
                    </Card>

                </div> : <Button className='m-3' variant="primary" size="lg" style={{
                    right: "5vw",
                    top: "10vh",
                    position: 'fixed',
                    zIndex: "5"
                    // alignSelf:"end"
                }}
                    onClick={() => { setIsCreating(true) }}
                >
                    + New Post
                </Button>}
            </div>
            {posts.map(post => {
                return <Card className='m-3' style={{ width: '50rem' }} key={post._id}>
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
                        <ListGroup.Item style={{
                            fontWeight: "bolder",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",


                        }}>
                            <div style={{
                                cursor: "pointer"
                            }} onClick={handleViewProfile.bind(this, post.user._id)}>
                               

                                <img src={post.avatar} alt="" height={"25vh"} width={"30vh"} /> {post.user.name}{' '}
                                
                                {profile.trainer? <Badge bg='secondary' className='m-2'>Trainer</Badge>:""}
                            </div>
                            {post.user._id === user._id ? "" :
                                <div >
                                    <Button variant={`${profile.following.includes(post.user._id) ? "danger" : "primary"}`} onClick={handleFollow.bind(this, post.user._id)}>{`${profile.following.includes(post.user._id) ? "Unfollow" : "Follow"}`}</Button>
                                </div>}
                        </ListGroup.Item>
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
                                }} onClick={() => setModalShow(true)}>{post.likes.length === 1 ? "1 Like" : `${post.likes.length} Likes`}</span>
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
                </Card>
            })}

        </div>
    )
}
