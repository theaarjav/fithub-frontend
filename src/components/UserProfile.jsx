import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge'
import { ExternalLink } from 'react-external-link'
import Spinner from 'react-bootstrap/esm/Spinner';

import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
export const UserProfile = () => {
    const navigate=useNavigate();
    const [Profile, setProfile] = useState([]);
    const [Loading, setLoading] = useState([true]);
    const [users, setusers]=useState([])
    const [currUser, setcurrUser]=useState({});
    const profileID = useParams().profileID
    const getProfile = async () => {
        var {data, status} = await axios.get(`https://maestrohub-backend.onrender.com/api/profile/${profileID}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(status===405) navigate('/editProfile')
        setProfile(data);
        var {data}=await axios.get(`https://maestrohub-backend.onrender.com/api/profile/allusers`);
        setusers(data.allprofiles)
        
        // console.log(Profile)
        // console.log(users)
    }
    const getUser=async ()=>{
        const {data}=await axios.get("https://maestrohub-backend.onrender.com/api/user/you", {
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        setcurrUser(data.user)
        setLoading(false);
    }
    useEffect(() => {
        if(!localStorage.getItem("maestrohub"))return navigate('/user/login')
        if(profileID===undefined|| profileID==="undefined" || profileID===null || profileID==="null" || profileID=="")return navigate('/editProfile')
        getProfile()
        getUser();
        // setLoading(false)
    }, [])
    const handleFollow=async()=>{
        // console.log("HandleFollow")
        const {data, status}=await axios.put(`https://maestrohub-backend.onrender.com/api/profile/${Profile.user._id}`, {}, {
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        Swal.fire(data.msg,"","info")
        getProfile();
        
        
    }
    function FollowersModal(props) {
        // console.log(typeof Profile.followers[0])
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Followers
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   
                      { Profile.followers.map((follower=>{
                        return  users.map((userprofile)=>{
                            return <div >
                            {userprofile.user._id === follower ? <Card>
                                <Card.Body style={{
                                    fontWeight: "bold"
                                }}><img src={`${userprofile.user.avatar}`} height={"25vh"} width={"30vh"} alt={`${userprofile.user.name}'s avatar`}></img> {userprofile.user.name}</Card.Body>
                            </Card> : ""}
                        </div>
                         })
                      }))
                        }
                    

                        
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    function FollowingModal(props) {
        // console.log(typeof Profile.followers[0])
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Following
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   
                      { Profile.following.map((following=>{
                        return  users.map((userprofile)=>{
                            return <div >
                            {userprofile.user._id === following ? <Card>
                                <Card.Body style={{
                                    fontWeight: "bold"
                                }}><img src={`${userprofile.user.avatar}`} height={"25vh"} width={"30vh"} alt={`${userprofile.user.name}'s avatar`}></img> {userprofile.user.name}</Card.Body>
                            </Card> : ""}
                        </div>
                         })
                      }))
                        }
                    

                        
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    const [FollowersmodalShow, setFollowersmodalShow] = useState(false);
    const [FollowingmodalShow, setFollowingmodalShow] = useState(false);
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

        </div> :!Profile?<div className='container' style={{
            display: "flex",
            padding: "5vh",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
        }}>User has no Profile</div>:
           Profile && Profile.user && <>
                <h1>
                    {<div style={{
                        display: "flex",
                        // alignItems:"center",
                        justifyContent: "center",
                        marginTop: "0.3vh"
                    }}>
                        {Profile.user.name}'s profile

                    </div>}

                </h1>

                <div className="container" style={{
                    justifyContent: "space-evenly",
                    display: "flex"
                }}>

                    <Card style={{
                        borderRight: "1px groove gray",
                        borderBottom: "1px groove gray",
                        width: "50vw"
                    }}>
                        <Card.Img variant="top" src={`${Profile.user.avatar}`} />
                        <Card.Body>
                            <Card.Title  style={{
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"space-between"
                        }}>
                                <div>
                                <Card.Subtitle className="mb-2 bold text-muted">{Profile.trainer?<Badge bg='secondary'>Trainer</Badge>:""}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted"><i class="fa-solid fa-location-dot"></i> {Profile.location}</Card.Subtitle>
                                    </div>
                                {Profile.user._id===currUser._id?"":
                                  <div >
                                      <Button variant={`${Profile.followers.includes(currUser._id)?"danger":"primary"}`} onClick={handleFollow}>{`${Profile.followers.includes(currUser._id)?"Unfollow":"Follow"}`}</Button>
                                    </div>
}
                            
                            </Card.Title>
                            <Card.Text>
                                {Profile.squat?<Button className='m-2' variant='info' disabled>Squat:{Profile.squat}</Button>:""}
                                {Profile.bench?<Button className='m-2' variant='warning' disabled>Bench:{Profile.bench}</Button>:""}
                                {Profile.deadlift?<Button className='m-2' variant='danger' disabled>Deadlift:{Profile.deadlift}</Button>:""}
                                {Profile.snatch?<Button className='m-2' variant='success' disabled>Snatch:{Profile.snatch}</Button>:""}
                                {Profile.cnj?<Button className='m-2' variant='dark' disabled>C&J:{Profile.cnj}</Button>:""}
                                {Profile.bio}<br />
                                {Profile.skills.map((skill) => {
                                    return <Badge key={skill} bg="secondary" className='m-1'>{skill}</Badge>

                                })
                                }
                            </Card.Text>

                            <div className="d-flex flex-row justify-content-start">

                                {Profile.facebook?<div className="p-2">
                                    <ExternalLink
                                        href={`${Profile.facebook}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <i className="fa-brands fa-facebook"></i>
                                    </ExternalLink>
                                </div>:""}
                                {Profile.instagram?<div className="p-2">
                                    <ExternalLink
                                        href={`${Profile.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fa-brands fa-instagram"></i>
                                    </ExternalLink>
                                </div>:""}
                                {Profile.twitter?<div className="p-2">
                                    <ExternalLink
                                        href={`${Profile.twitter}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fa-brands fa-twitter"></i>
                                    </ExternalLink>
                                </div>:""}
                                
                            </div>
                            
                            <div className="row" style={{
                                justifyContent:"center",
                                alignItems:"center"
                            }}>
                                <div className="followering col-6">
                                <span  style={{
                                    display:"flex",
                                    justifyContent:"center",
                                cursor:"pointer",
                                fontWeight:"bold"
                            
                                
                            }} variant="outline" onClick={() => {
                                setFollowersmodalShow(true)}}>
                                {Profile.followers.length===1?"1 Follower": Profile.followers.length+ " Followers"} 
                            </span>{' '}
                                </div>
                                <div className="followering col-6">
                                <span style={{
                                    justifyContent:"center",
                                    display:"flex",
                                cursor:"pointer",
                                fontWeight:"bold"
                            }} variant="primary" onClick={() => {
                                setFollowingmodalShow(true)}}>
                                {Profile.following.length} Following
                            </span>
                                </div>
                            </div>
                            
                            

                            <FollowersModal
                                show={FollowersmodalShow}
                                onHide={() => setFollowersmodalShow(false)}
                            />
                            <FollowingModal
                                show={FollowingmodalShow}
                                onHide={() => setFollowingmodalShow(false)}
                            />
                        </Card.Body>
                    </Card>
                    <div className="container m-2"

                    >
                        
                        <h3>
                            Competitions:
                        </h3>
                        <div className="container competition p-2" style={
                            {
                                display: "flex",
                                backgroundColor: "whitesmoke",
                                flexDirection: "column",
                                justifyContent: "space-around"
                            }
                        }>


                            {Profile.competitions.map((exp) => {
                                return (
                                    <li
                                        className="list-group-item my-2"
                                        key={exp._id}
                                    >
                                        <span style={{
                                            fontWeight: "bold",
                                        }}>
                                            {Profile.competitions.indexOf(exp) + 1}.&#41;</span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                             {exp.title?"Title: "+exp.title :"" }
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                        {exp.represented?"Represented: "+exp.represented :"" }                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                        {exp.squat?"Squat: "+exp.squat :"" }
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                        {exp.bench?"Bench: "+exp.bench :"" }
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                        {exp.bench?"Deadlift: "+exp.deadlift :"" }
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                        Total: {(exp.bench?Number(exp.bench):0) +(exp.deadlift?Number(exp.deadlift):0)+(exp.squat?Number(exp.squat):0) }
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                        {exp.snatch?"Snatch: "+exp.snatch :"" }
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                        {exp.cnj?"Clean & Jerk: "+exp.cnj :"" }
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                        {exp.position?"Position/Rank: "+exp.position :"" }
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                        {exp.location?"Location: "+exp.location :"" }
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                        {exp.from?"From: "+exp.from :"" }
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                            
                                            {exp.to  ?"To: "+ exp.to : ""}
                                        </span>
                                        <br />
                                        <span style={{ fontWeight: "bold" }}>
                                            {exp.description?"About: "+exp.description:""}
                                        </span>
                                        <br />
                                    </li>
                                );
                            })}
                            {/* <Button  variant="primary"
                             style={{
                                width:"15vw"
                             }}
                             >Edit Experience</Button> */}
                        </div>
                    </div>

                </div>
            </>
    )
}
