import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const NewEd = () => {
    const navigate=useNavigate();
    const [education, setEducation] = useState({
        school: "",
        degree: "",
        fieldOfStudy: "",
        from: "",
        to: "",
        current: false,
        description: "",
    });
    if(!localStorage.getItem("maestrohub"))return navigate("user/login");
    const handleChange=(e)=>{
        setEducation({
            ...education, [e.target.name]:e.target.value,
        })
        console.log(education)
      }
      const handleSubmit=async(e)=>{

        e.preventDefault();

        if(education.current && education.to){
            return Swal.fire("Enter valid values for leaving Date", "", "warning")
        }

        let {data, status}=await axios.put("https://maestrohub-backend.onrender.com/api/profile/education", education, {
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem("maestrohub")}`

            }
        });
        if(status===200){
            Swal.fire(data.msg, "", "success");
            navigate("/editProfile")
        }
      }
    return (
        <div className='container'>


            <Form>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>School</Form.Label>
                    <Form.Control name='school' type="text" placeholder="Enter school" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        School/College/University you Studied at
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Degree</Form.Label>
                    <Form.Control name="degree" type="text" placeholder="Enter Degree/level of education"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Degree/Equivalent Study you completed there
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Field Of Study</Form.Label>
                    <Form.Control name="location" type="text" placeholder="Enter your field of study"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Your field of study
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>From</Form.Label>
                    <Form.Control name="from" type="date"   onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Starting Date
                    </Form.Text>
                </Form.Group>
                <Form.Group  className="mb-3" controlId="formBasicText">
                    <Form.Label>To</Form.Label>
                    <Form.Control name="to" disabled={education.current} type="date" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Completion Date
                    </Form.Text>
                </Form.Group>
                <Form.Group value={education.to} disabled={education.to!==""} className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Current" onChange={()=>{education.current=!education.current}} />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Submit
                </Button>
            </Form>

        </div>
    )
}
