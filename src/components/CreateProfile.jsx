import axios from 'axios';
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export const CreateProfile = () => {
    const [profile, setprofile] = useState({
        company:"",
        website:"",
        skills:[""],
        bio:"",
        location:"",
        designation:"",
        githubHandle:""
    })
    const navigate=useNavigate();
    if(!localStorage.getItem("maestrohub"))return navigate("/user/login");

    const handleChange=(e)=>{
        
        setprofile({...profile, [e.target.name]:e.target.value});
        // console.log(profile)
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        let skillArray=[];
        profile.skills.split(",").map(skill=>skill.trim()).forEach(element => {
            skillArray.push(element)
        });
        setprofile({
            ...profile, [profile.skills]:skillArray
        })
        let {data, status}= await axios.post("https://maestrohub-backend.onrender.com/api/profile/new", profile, {
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        if(status!==200){
            navigate("/");
            return Swal.fire(data.msg,"", "error");
        }
        Swal.fire(data.msg,"", "success");
        navigate("/users")
    }

    return (
        <div className='container m-2'>
            <h1 className='justify-content-center m-5'>You Don't have any Profile. Create your Profile</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Company</Form.Label>
                    <Form.Control name="company" type="text" placeholder="Enter your company" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Organization you work in
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Website</Form.Label>
                    <Form.Control name="website" type="text" placeholder="Enter your website" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Your Website
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Skills</Form.Label>
                    <Form.Control name="skills" type="text" placeholder="Enter your skills" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Skills you have
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control name='bio' type="text" placeholder="Enter your bio" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Little about yourself
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Location</Form.Label>
                    <Form.Control name='location' type="text" placeholder="Enter your location" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Where do you live 
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control name='bio' type="text" placeholder="Enter your designation" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        What's your current designation
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>GitHub</Form.Label>
                    <Form.Control name='githubHandle' type="text" placeholder="Enter your gitHub @" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Your GitHub @
                    </Form.Text>
                </Form.Group>

                
                {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group> */}
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}
