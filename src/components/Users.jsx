import React, { useState, useEffect } from 'react'
import Spinner from './Spinner'
import axios from 'axios'
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
export const Users = () => {
  const navigate=useNavigate();
  const [Loading, setLoading] = useState(true)
  const [profiles, setprofiles] = useState([])
  const [currProfile, setCurrProfile] = useState({});
  const getUserProfile = async () => {
    let { data, status } = await axios.get('https://maestrohub-backend.onrender.com/api/profile/me', {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
      }
    })
    if (status === 200){ setCurrProfile(data.profile);
    // console.log(data.profile)
  }
    // setLoading(false);
  }
  const getProfiles = async () => {
    let allprofile = await axios.get("https://maestrohub-backend.onrender.com/api/profile/allusers");
    setprofiles(allprofile.data.allprofiles);
    if(!localStorage.getItem("maestrohub"))setLoading(false);
    // console.log(allprofile.data.allprofiles)
    // setLoading(false);
  }
  useEffect(() => {
    getProfiles();
    if (localStorage.getItem("maestrohub")){
      // setLoading(true)
      getUserProfile()
    }
    setLoading(false);
      
  }, [])

  const handleFollow=async(id)=>{
    const { data, status } = await axios.put(`https://maestrohub-backend.onrender.com/api/profile/${id}`, {}, {
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
      }
  })
  if (status === 200){
     Swal.fire(data.msg, "", "info")
    getUserProfile();
    }
  }

  return (
    <>
      {Loading ? <div className='container' style={{
        display: "flex",
        padding: "5vh",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
      }}>

        <Spinner />

      </div> :
        <>
          <div className="container">
            {
              profiles.length ? profiles.map((profile) => {
                // console.log(profile._id)
                return <div className="container row m-3 p-1" style={{
                  border: "1px solid gray",
                  alignItems: "center"
                }} key={profile._id}>
                  <div className="col-4"><img src={`${profile.user.avatar}`} alt={`User's profile photo/avatar`} height={'200vh'} width={'200vh'} style={{
                    // borderRight: "1px ridge black",
                    marginLeft: "5vw",
                    borderRadius: "50%"
                  }}></img></div>
                  <div className="col-8">


                    <Card>
                      <Card.Body>
                        <Card.Title>{profile.user.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{profile.trainer?<Badge bg="secondary">Trainer</Badge>:""}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted"><i class="fa-solid fa-location-dot"></i> {profile.location}</Card.Subtitle>
                        <Card.Text>
                          <div className="container" style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "normal"
                          }}>
                            {profile.skills.map((skill) => {
                              return <Badge key={skill} bg="danger" className='m-1'>{skill}</Badge>

                            })
                            }

                          </div>

                        </Card.Text>
                        {/* <Card.Link to="/">View Profile</Card.Link>
                        <Card.Link href="#">Another Link</Card.Link> */}
                        <Button variant={'outline-primary'} onClick={()=>navigate(`/users/${profile._id}`)} >View Profile</Button>{' '}

                          {localStorage.getItem("maestrohub") && currProfile.user && currProfile.following && currProfile.followers?
                          profile.user._id===currProfile.user._id?"":
                        <Button variant={`${currProfile.following.includes(profile.user._id) ? "danger" : "primary"}`} onClick={handleFollow.bind(this, profile.user._id)}>{`${currProfile.following.includes(profile.user._id) ? "Unfollow" : "Follow"}`}</Button>
                      :""}
                      </Card.Body>
                    </Card>

                  </div>
                </div>
              }) : ""
            }
          </div>
        </>
      }
    </>
  )
}
