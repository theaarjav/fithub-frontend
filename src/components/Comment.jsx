import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'
import Button from 'react-bootstrap/esm/Button'
import Spinner from 'react-bootstrap/esm/Spinner'
import './SelectedPost.css'
import Badge from 'react-bootstrap/esm/Badge'
export const Comment = (props) => {
    const comment = props.comment;
    const [expand, setExpand] = useState(false)
    const [reply, setReply] = useState(false)
    const [inputReview, setInputReview] = useState("")
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
        if (!localStorage.getItem("maestrohub")) return navigate('/user/login')
        getPost();
        getuser();
        getProfile();

    }, [])
    const changeIpHandler = (e) => {
        setInputReview(e.target.value);
    }
    // const allReviews=props.allReviews
    const handleExpandClick = () => {

        setExpand(!expand);
    }
    const handleReplyClick = () => {
        setReply(!reply)
        if (!expand) setExpand(true)
    }
    const handleShareReply = async (id) => {
        const { data, status } = await axios.put(`https://maestrohub-backend.onrender.com/api/post/comments/${post._id}/${id}`, { text: inputReview }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        if (status === 200) {
            setReply(false);
            // getAllReviews();
            getPost();
            Swal.fire(data.msg, "", "success")
        }
        else Swal.fire(data.msg, "Error Posting Comment", "error")

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

    const handleViewProfile = async (id) => {
        console.log("clicked",id)
        // return Swal.fire("get","","info")
        let { data, status } = await axios.get(`https://maestrohub-backend.onrender.com/api/profile/users/${id}`)
        console.log(data, status)
        if (status === 200)
        {
            let profile;
            if (data.profile) {
                profile = data.profile._id;
                navigate(`/users/${profile}`)
            }else{
                return Swal.fire(data.msg,"","info")
            }
        } 
            
        
        
    }

    const handleCommentDelete = async (id) => {
        {post.comments.map((childcomment) => {
            if(childcomment.parent === id) handleCommentDelete(this, childcomment._id)
        })}
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
    return (
        Loading ? <Spinner /> : post.comments &&
            <div className={`${comment._id} review`}




            >   <div className='comment-header'>
                    <div className="comment-header-left">

                        <p onClick={handleViewProfile.bind(this, comment.user)}><img src={comment.avatar} alt="" height={"25vh"} width={"30vh"} /> {comment.name}{' '}
                        { profile.trainer? 
                        <Badge bg='secondary' >Trainer</Badge>
                         :""}
                        </p>{' '}
                        <span>{timeDiff(new Date(), new Date(comment.date))}</span>
                    </div>
                    <div className="comment-header-right">
                        {comment.user === user._id ?
                            <Button variant={'danger'} onClick={handleCommentDelete.bind(this, comment._id)}><i className="fa-solid fa-trash"/></Button>

                            :

                            <Button variant={`${profile.following.includes(comment.user) ? "danger" : "primary"}`} onClick={handleFollow.bind(this, comment.user)}>{`${profile.following.includes(comment.user) ? "Unfollow" : "Follow"}`}</Button>
                        }
                    </div>
                </div>
                <p className='comment-text'>
                    {comment.text}
                </p>
                <div>
                    <button className='btn-showReply showHide' onClick={handleExpandClick}>{!expand ? "Show Replies" : "Hide Replies"}</button>
                    {reply ?
                        <div style={{ display: "block" }}>
                            <textarea type='text' className='new-reply-input' onChange={changeIpHandler} />
                            <button className='btn-showReply cancel' onClick={handleReplyClick}> <i class="fa-solid fa-close"></i> Cancel</button>
                            <button className='btn-showReply post-reply' onClick={handleShareReply.bind(this, comment._id)}><i class="fa-solid fa-share"></i> Comment</button>
                        </div> :
                        <button className='btn-showReply reply' onClick={handleReplyClick}><i class="fa-solid fa-share"></i> Reply</button>



                    }
                </div>
                <div style={
                    {
                        padding: "25px",
                        borderLeft: "1px solid gray",
                        display: expand ? "block" : "none"
                    }

                }>

                    {post.comments.map((childcomment) => {
                        return childcomment.parent === comment._id ? <Comment comment={childcomment} /> : <></>
                    })}
                </div>
            </div>
    )
}
