import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const NewExp = () => {
    const navigate=useNavigate();
    const [experience, setExperience] = useState({
        title: "",
        company: "",
        location: "",
        from: "",
        to: "",
        current: false,
        description: "",
    });
    if(!localStorage.getItem("maestrohub"))return navigate("user/login");
    const handleChange=(e)=>{
        setExperience({
            ...experience, [e.target.name]:e.target.value,
        })
        // console.log(experience)
      }
      const handleSubmit=async(e)=>{

        e.preventDefault();

        if(!experience.from ){
            return Swal.fire("Enter valid values for Date", "", "warning")
        }

        let {data, status}=await axios.put("https://maestrohub-backend.onrender.com/api/profile/experience", experience, {
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
                    <Form.Label>Title of your Competition</Form.Label>
                    <Form.Control name='title' type="text" placeholder="Enter title" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        What would you describe you competition as, Powerlifting/Weightlifting/Bodybuilding/Strongman, etc.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Represented</Form.Label>
                    <Form.Control name="represented" type="text" placeholder="Enter whom you represented(Write Self if you went on your own)"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        What did you reoresent, your city, state, district, company, college, etc.? 
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Location</Form.Label>
                    <Form.Control name="location" type="text" placeholder="Enter location"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        Where did the meet took place?
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Squat</Form.Label>
                    <Form.Control name="squat" type="number" placeholder="Enter Squat in kgs"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        How much did you squat at the competition?
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Bench</Form.Label>
                    <Form.Control name="bench" type="number" placeholder="Enter Bench in kgs"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                    How much did you bench at the competition?
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Deadlift</Form.Label>
                    <Form.Control name="deadlift" type="number" placeholder="Enter Deadlift in kgs"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                    How much did you deadlift at the competition?
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Snacth</Form.Label>
                    <Form.Control name="snatch" type="number" placeholder="Enter Snatch in kgs"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                    How much did you snatched at the competition?
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Clean And Jerk</Form.Label>
                    <Form.Control name="cnj" type="number" placeholder="Enter Clean and Jerk in kgs"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                    How much was your clean and jerk at the competition?
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Position</Form.Label>
                    <Form.Control name="position" type="number" placeholder="Your final ranking"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                    At what position did you finish the competition?
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>From</Form.Label>
                    <Form.Control name="from" type="date"   onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        When did the competition start
                    </Form.Text>
                </Form.Group>
                <Form.Group  className="mb-3" controlId="formBasicText">
                    <Form.Label>To</Form.Label>
                    <Form.Control name="to" disabled={experience.current} type="date" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        On what date did it end?
                    </Form.Text>
                </Form.Group>
                {/* <Form.Group value={experience.to} disabled={experience.to!==""} className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Current" onChange={()=>{experience.current=!experience.current}} />
                </Form.Group> */}
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>More </Form.Label>
                    <Form.Control name="description" type="text" placeholder="How would you describe your experience at the competition"  onChange={handleChange}/>
                    <Form.Text className="text-muted">
                        What more would you like to say about the competition?
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Submit
                </Button>
            </Form>

        </div>
    )
}
