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
import { useParams } from 'react-router-dom';
import Badge from 'react-bootstrap/esm/Badge';
// import { useNavigate } from 'react-router-dom';
export const SelectedPost = () => {
    const navigate = useNavigate();
    const [post, setpost] = useState([]);
    const [user, setuser] = useState([])
    const [profile, setprofile] = useState([])
    const [Loading, setLoading] = useState(true)
    const post_id = useParams().postID
    const getPost = async () => {
        let { data, status } = await axios.get(`https://maestrohub-backend.onrender.com/api/post/${post_id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        // setpost(data.post);

        if (status === 200) setpost(data.post)
        console.log(post.comments)
    }
    const getuser = async () => {
        let { data, status } = await axios.get(`https://maestrohub-backend.onrender.com/api/user/you`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        if (status === 200) {
            // console.log(data)
            setuser(data.user)
        }
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
        setLoading(false)
    }
    useEffect(() => {
        if(!localStorage.getItem("maestrohub"))return navigate('/user/login')
        getPost();
        getuser();
        getProfile();

    }, [])

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
            // getAllPosts();
            getPost();
        } else {
            Swal.fire("Error", "", "error");
            navigate("/feed");
        }
    }
    const [newcomment, setComment] = useState("");
    const handleCommentChange = (e) => {
        // console.log(user)
        setComment(e.target.value);
    }
    const handlenewCommentSubmit = async () => {
        if (newcomment === "" || newcomment === null || newcomment === undefined) {
            return Swal.fire("Comment can't be empty", "", "warning")
        }
        let { data, status } = await axios.put(`https://maestrohub-backend.onrender.com/api/post/comments/${post_id}`, {
            text: newcomment
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        if (status === 200) {
            Swal.fire(data.msg, "", "success");
            getPost();
            // getuser();
            setComment("");
        }
    }

    const handleCommentDelete = async (id) => {
        let { data, status } = await axios.delete(`https://maestrohub-backend.onrender.com/api/post/comments/${post_id}/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        if (status === 200) {
            Swal.fire(data.msg, "", "success")
            getPost()
        }
    }

    return (
        <div>
            {!Loading ? Object.keys(post).length > 0 && post.user && Object.keys(post.user).length > 0 ? <>

                <Card className='m-2' style={{ width: '80vw' }} key={post._id}>
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
                                    if (status === 200) getPost();

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
                                        getPost();
                                }}></i>}{' '}<span style={{
                                    cursor: "pointer"
                                }} >{post.likes.length === 1 ? "1 Like" : `${post.likes.length} Likes`}</span>
                                {/* <DropdownButton
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
                                </DropdownButton> */}

                            </ListGroup.Item>
                            <ListGroup.Item className='col-3' style={{
                                // display:"flex",
                                textAlign: "center",
                                // justifyContent: "center"
                            }}></ListGroup.Item>
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
                <div className="container m-5" style={{
                    margin: "3vh auto"
                }}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label> <h4>New Comment: </h4></Form.Label>
                        <Form.Control name="text" value={newcomment} as="textarea" rows={3} onChange={handleCommentChange} />
                        <div style={{
                            display: "flex",
                            justifyContent: "end"
                        }}>

                            <Button className='m-2' onClick={handlenewCommentSubmit} > + Add Comment</Button>
                        </div>
                    </Form.Group>
                </div>
                <div className="container">
                    <h3>{post.comments.length} Comments:</h3>
                </div>
                <div className="container">
                    {post.comments.map(comment => {
                        return <div key={comment._id} style={{
                            disple: "flex"
                        }} className="container m-2 p-2">
                            <Card style={{ width: '80vw' }}>
                                <Card.Body>
                                    <Card.Title><ListGroup.Item style={{
                                        fontWeight: "bolder",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "space-between",


                                    }}>
                                        <div style={{
                                            cursor: "pointer"
                                        }} onClick={handleViewProfile.bind(this, post.user._id)}>
                                            <img src={comment.avatar} alt="" height={"25vh"} width={"30vh"} /> {comment.name}{' '}
                                            {profile.trainer?<Badge bg='secondary' >Trainer</Badge>:""}
                                        </div>
                                        {comment.user === user._id ? <div>
                                            <Button variant={'danger'} onClick={handleCommentDelete.bind(this, comment._id)}><i className="fa-solid fa-trash"></i> Comment</Button>
                                        </div>
                                            :
                                            <div >
                                                <Button variant={`${profile.following.includes(comment.user) ? "danger" : "primary"}`} onClick={handleFollow.bind(this, comment.user)}>{`${profile.following.includes(comment.user) ? "Unfollow" : "Follow"}`}</Button>
                                            </div>}
                                    </ListGroup.Item>
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                                    <Card.Text>
                                        {comment.text}
                                    </Card.Text>
                                    <Card.Text className='text-muted'>

                                        {timeDiff(new Date(), new Date(comment.date))}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    })}
                </div>
            </> : "" : ""}
        </div>
    )
}
