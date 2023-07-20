import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/esm/Spinner'
export const EditProfile = () => {
    const navigate = useNavigate();
    if (!localStorage.getItem("maestrohub")) {
        navigate("/user/login")
    }
    const [user, setuser] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [Profile, setProfile] = useState([]);
    const [change, setChange] = useState([])
    const [image, setimage] = useState("");
    // const [Loading, setLoading]=useState(true);
    const getUser = async () => {
        const { data } = await axios.get("https://maestrohub-backend.onrender.com/api/user/you", {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        });
        setuser(data.user);
        // setLog(true);
        // console.log(data.user)
    }

    const getProfile = async () => {
        const { data, status } = await axios.get(`https://maestrohub-backend.onrender.com/api/profile/me`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        });
        if (status === 405) return;
        // console.log(status);
        setProfile(data.profile);
        setChange(data.profile)
        // setLoading(false);
        // console.log(data.profile)
    }

    const handleExpDelete = async (expID) => {
        const { data, status } = await axios.delete(`https://maestrohub-backend.onrender.com/api/profile/experience/${expID}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        setProfile(data);
        // console.log(data.profile)
        if (status === 200) Swal.fire(data.msg, "Deleted", "success")
        // navigate("/editProfile")
        getProfile();
    }
    

    const [Instaerr, setInstaerr] = useState(false)
    const [fbErr, setfbErr] = useState(false)
    const [Twitterr, setTwitterr] = useState(false)
    const urlPatternValidation = (e) => {
        if(!e.target.value || e.target.value.trim()==="") 
        {
            if(e.target.name==='instagram')
            setInstaerr(false);
            else if(e.target.name==='facebook')
            setfbErr(false);
            else setTwitterr(false)
            return;
        }

        const regex = new RegExp('((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)');    
         if(!regex.test(e.target.value)){
            
            if(e.target.name==='instagram')setInstaerr(true);
            else if(e.target.name==='facebook')setfbErr(true);
            else setTwitterr(true);
        }else{
            if(e.target.name==='instagram')setInstaerr(false);
            else if(e.target.name==='facebook')setfbErr(false);
            else setTwitterr(false);
        }
        setChange({...change, [e.target.name]:e.target.value})
      };
    const handleChange = (e) => {

        setChange({ ...change, [e.target.name]: e.target.value });

    }


    const handleSubmit = async (e) => {
        if(Instaerr || fbErr || Twitterr){
            return Swal.fire("Please Enter correct URLs","In social media section","warning")
        }
        setuser({
            ...user,
            avatar: image
        })
        e.preventDefault();
        const { data, status } = await axios.put(`https://maestrohub-backend.onrender.com/api/profile/update`, change, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("maestrohub")}`
            }
        })
        if (status === 200) {
            Swal.fire(data.msg, "", "success");
            navigate(`/users/${Profile._id}`)
        }
        else Swal.fire("Error occured", "", "error")
    }


    useEffect(() => {
        if (!localStorage.getItem("maestrohub")) return navigate('/user/login')
        getUser();
        getProfile();
        console.log(Profile)
        setLoading(false)
    }, [])

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        // setuser({
        //     ...user,
        //     avatar:base64.toString()
        // })
        setimage(base64.toString());
        setChange({
            ...Profile,
            image: base64.toString(),
        });
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

    const handleSkillChnge = (e) => {
        // console.log(e.target)
        // let name = e.target.id.split('-')[1];
        // console.log(name)
        let newskill =change.skills? change.skills.toString():"";
        var index = newskill.search(e.target.value);
        // console.log(index)
        if (index >= 0) {
            // if(index!=0)
            var endInd = index + e.target.value.length;
            const nString = newskill.replace(`, ${e.target.value}`, '');
            newskill = nString
            // console.log(newskill)
        } else {
            newskill += `, ${e.target.value}`
            // console.log(newskill)
        }
        setChange({ ...change, skills: newskill })
    }
    
    const [companyDis, setcompanyDis] = useState(true)
    const [locationDis, setlocationDis] = useState(true)
    const [websiteDis, setwebsiteDis] = useState(true)
    const [bioDis, setbioDis] = useState(true)
    const [designationDis, setdesignationDis] = useState(true)
    const [skillsDis, setskillsDis] = useState(true)
    const [trainerDis, settrainerDis]=useState(true);
    const [LinksDis, setLinksDis]=useState(true)
    return (
        <>
            {
                Loading ? <div className='container' style={{
                    display: "flex",
                    padding: "5vh",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center"
                }}>

                    <Spinner />

                </div> :
                    <div className="container">

                        {<>
                            <div className="container row m-5">


                                <div className='container col-4 '
                                >
                                    <div style={{
                                        border: "2px solid black",
                                        borderRadius: "5px",
                                        display: 'flex',
                                        flexDirection: "column",
                                        // alignItems:"center",
                                        // justifyContent:'center',
                                        padding: '5vh'
                                    }}>
                                        <img src={`${change.image ? change.image : user.avatar}`} height={"150vw"} alt='User avatar' style={{
                                            // borderRight: "1px groove gray"
                                            borderBottom: '2px solid black',
                                            padding: '2px'
                                        }}></img>
                                        <Form.Group controlId="formFile" className="mb-3 m-2">
                                            <Form.Label><h5>Update avatar:</h5></Form.Label>
                                            <Form.Control onChange={uploadImage} type="file" />
                                            {/* <Button variant='primary' ></Button> */}
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formGridAddress1">
                                            <Form.Label>Social Media</Form.Label>
                                            <i className="fa-regular fa-pen-to-square" style={{
                                                marginLeft: "2vw", cursor: "pointer"
                                            }} onClick={() => setLinksDis(false)}></i><br />
                                            
                                                <div className='m-2' style={
                                                    {
                                                        display:'flex',
                                                        // flexWrap:'wrap',
                                                        flexDirection:'row',
                                                        justifyContent:'space-between'
                                                    }
                                                }> 
                                                <i className="fa-brands fa-instagram m-2"> </i>
                                                <Form.Control disabled={LinksDis?'disabled':undefined} name='instagram' value={change.instagram} type="text" placeholder="Your Instagram" onChange={urlPatternValidation} />
                                                </div>
                                                    <Form.Text className='text-danger'  >{Instaerr?"Please provide the correct link, make sure to give the link with https://":""}</Form.Text>
                                                <div className='m-2' style={
                                                    {
                                                        display:'flex',
                                                        // flexWrap:'wrap',
                                                        flexDirection:'row',
                                                        justifyContent:'space-between'
                                                    }
                                                }> 
                                                <i className="fa-brands fa-facebook m-2"> </i>
                                                <Form.Control name='facebook' disabled={LinksDis?'disabled':undefined}  value={change.facebook} type="text" placeholder="Your Facebook" onChange={urlPatternValidation} />
                                                </div>
                                                    <Form.Text className='text-danger'  >{fbErr?"Please provide the correct link, make sure to give the link with https://":""}</Form.Text>
                                                <div className='m-2' style={
                                                    {
                                                        display:'flex',
                                                        // flexWrap:'wrap',
                                                        flexDirection:'row',
                                                        justifyContent:'space-between'
                                                    }
                                                }> 
                                                <i className="fa-brands fa-twitter m-2"> </i>
                                                <Form.Control name='twitter' disabled={LinksDis?'disabled':undefined} value={change.twitter} type="text" placeholder="Your Twitter" onChange={urlPatternValidation} />
                                                </div>
                                                    <Form.Text className='text-danger'  >{Twitterr?"Please provide the correct link, make sure to give the link with https://":""}</Form.Text>
                                                {/* <Button variant='outline-warning' className='m-2'> Done</Button> */}
                                                </Form.Group>
                                    </div>
                                    <div>
                                        <Form>
                                            <Form.Group className="mb-3" controlId="formlink">
                                                <Form.Label>Trainer/Coach </Form.Label>
                                            <i className="fa-regular fa-pen-to-square" style={{
                                                marginLeft: "2vw", cursor: "pointer"
                                            }} onClick={() => settrainerDis(false)}></i>
                                            <Form.Check // prettier-ignore
                                                    type="checkbox"
                                                    disabled={trainerDis ? 'disabled' : undefined}
                                                    checked={change.trainer  ? 'checked' : undefined}
                                                    id={`default-checkbox`}
                                                    label={`Are you a trainer?`}
                                                    // value={'Powerlifter'}
                                                    onClick={()=>{
                                                        setChange({...change, trainer:!change.trainer})
                                                    }}

                                                />
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>

                                <div className="container col-8">
                                    <Form>


                                        <Form.Group className="mb-3" controlId="formGridAddress1">
                                            <Form.Label>Location</Form.Label>
                                            <i className="fa-regular fa-pen-to-square" style={{
                                                marginLeft: "2vw", cursor: "pointer"
                                            }} onClick={() => setlocationDis(false)}></i>
                                            {locationDis ? <Form.Control name='location' disabled value={change.location} placeholder="Your Address" onChange={handleChange} />
                                                : <Form.Control name='location' value={change.location} type="text" placeholder="Your address" onChange={handleChange} />}


                                        </Form.Group>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="formGridEmail">
                                                <Form.Label>Squat</Form.Label>
                                                <i className="fa-regular fa-pen-to-square" style={{
                                                    marginLeft: "2vw", cursor: "pointer"
                                                }} onClick={() => setcompanyDis(false)}></i>
                                                {companyDis ? <Form.Control disabled name='squat' value={change.squat} type="number" placeholder="squat" onChange={handleChange} /> :
                                                    <Form.Control name='squat' value={change.squat} type="number" placeholder="squat" onChange={handleChange} />}
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="formGridPassword">
                                                <Form.Label>Bench</Form.Label>
                                                <i className="fa-regular fa-pen-to-square" style={{
                                                    marginLeft: "2vw", cursor: "pointer"
                                                }} onClick={() => setwebsiteDis(false)}></i>
                                                {websiteDis ? <Form.Control name='bench' disabled value={change.bench} type="number" placeholder="bench" onChange={handleChange} /> :
                                                    <Form.Control name='bench' value={change.bench} type="number" placeholder="bench" onChange={handleChange} />}
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="formGridAddress2">
                                                <Form.Label>Deadlift</Form.Label>
                                                <i className="fa-regular fa-pen-to-square" style={{
                                                    marginLeft: "2vw", cursor: "pointer"
                                                }} onClick={() => setdesignationDis(false)}></i>
                                                {designationDis ? <Form.Control name='deadlift' disabled value={change.deadlift} placeholder="deadlift" onChange={handleChange} />
                                                    : <Form.Control name='deadlift' value={change.deadlift} type="number" placeholder="deadlift" onChange={handleChange} />}

                                            </Form.Group>
                                        </Row>

                                        


                                        <Form.Group className="mb-3" controlId="formGridAddress1">
                                            <Form.Label>Bio</Form.Label>
                                            <i className="fa-regular fa-pen-to-square" style={{
                                                marginLeft: "2vw", cursor: "pointer"
                                            }} onClick={() => setbioDis(false)}></i>
                                            {bioDis ? <Form.Control name='bio' disabled value={change.bio} placeholder="About You" onChange={handleChange} /> :
                                                <Form.Control name='bio' value={change.bio} type="text" placeholder="About you" onChange={handleChange} />}

                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formGridAddress1">
                                            <Form.Label>What tags would suits you?</Form.Label>
                                            <i className="fa-regular fa-pen-to-square" style={{
                                                marginLeft: "2vw", cursor: "pointer"
                                            }} onClick={() => setskillsDis(!skillsDis)}></i>

                                            <div className='mb-3' style={{
                                                display: "flex",
                                                justifyContent: "space-around",
                                                flexWrap: "wrap"
                                            }}>
                                                <Form.Check // prettier-ignore
                                                    type="checkbox"
                                                    disabled={skillsDis ? 'disabled' : undefined}
                                                    checked={change.skills && change.skills.includes('Powerlifter') ? 'checked' : undefined}
                                                    id={`default-checkbox`}
                                                    label={`Powerlifter`}
                                                    value={'Powerlifter'}
                                                    onClick={handleSkillChnge}

                                                />
                                                <Form.Check // prettier-ignore
                                                    type="checkbox"
                                                    disabled={skillsDis ? 'disabled' : undefined}

                                                    checked={change.skills && change.skills.includes('Bodybuilder') ? 'checked' : undefined}
                                                    id={`default-checkbox`}
                                                    label={`Bodybuilder`}
                                                    value={"Bodybuilder"}
                                                    onClick={handleSkillChnge}
                                                />
                                                <Form.Check // prettier-ignore
                                                    type="checkbox"
                                                    disabled={skillsDis ? 'disabled' : undefined}

                                                    checked={change.skills && change.skills.includes('Callisthenics') ? 'checked' : undefined}
                                                    id={`default-checkbox`}
                                                    label={`Callisthenics`}
                                                    value={"Callisthenics"}
                                                    onClick={handleSkillChnge}
                                                />
                                                <Form.Check // prettier-ignore
                                                    type="checkbox"
                                                    disabled={skillsDis ? 'disabled' : undefined}

                                                    checked={change.skills && change.skills.includes('Crossfit') ? 'checked' : undefined}
                                                    id={`default-checkbox`}
                                                    label={`Crossfit`}
                                                    value={"Crossfit"}
                                                    onClick={handleSkillChnge}
                                                />
                                                <Form.Check // prettier-ignore
                                                    type="checkbox"
                                                    disabled={skillsDis ? 'disabled' : undefined}

                                                    checked={change.skills && change.skills.includes('Fitness') ? 'checked' : undefined}
                                                    id={`default-checkbox`}
                                                    label={`Fitness`}
                                                    value={"Fitness"}
                                                    onClick={handleSkillChnge}
                                                />
                                                <Form.Check // prettier-ignore
                                                    type="checkbox"
                                                    disabled={skillsDis ? 'disabled' : undefined}

                                                    checked={change.skills && change.skills.includes('Just enjoy here') ? 'checked' : undefined}
                                                    id={`default-checkbox`}
                                                    label={`idk, I just enjoy here`}
                                                    value={"Just enjoy here"}
                                                    onClick={handleSkillChnge}
                                                />
                                                <Form.Check // prettier-ignore
                                                    type="checkbox"
                                                    disabled={skillsDis ? 'disabled' : undefined}

                                                    checked={change.skills && change.skills.includes('Strongman') ? 'checked' : undefined}
                                                    id={`default-checkbox`}
                                                    label={`Strongman`}
                                                    value={"Strongman"}
                                                    onClick={handleSkillChnge}
                                                />

                                            </div>


                                            {/* <Form.Text>Make sure your skills are seperated by ','</Form.Text> */}
                                        </Form.Group>




                                        <Button variant="success" onClick={handleSubmit}>
                                            Save
                                        </Button>{' '}
                                        <Button variant="secondary" onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/users/${Profile._id}`)
                                        }}>
                                            View Profile
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                            {/* <Button variant="primary" onClick={() => navigate("/createProfile")}>+ Add Profile</Button>{' '} */}
                            <Button variant="secondary" onClick={() => navigate("/addExperience")}> <i className="fa fa-user-tie" /> Add Competition/Meet Experience</Button>{' '}
                            
                            {Object.keys(Profile).length && Profile.competitions && Profile.competitions.length ?
                                <div className="container">
                                    <h3>
                                        Competition Overview
                                    </h3>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Represented</th>
                                                <th>Squat</th>
                                                <th>Bench</th>
                                                <th>Deadlift</th>
                                                <th>Snatch</th>
                                                <th>CleanAndJerk</th>
                                                <th>Total</th>
                                                <th>Position</th>
                                                <th>Location</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Description</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Profile.competitions.map(exp => {
                                                console.log(exp)
                                                return <tr key={exp._id}>
                                                    <td>{exp.title}</td>
                                                    <td>{exp.represented}</td>
                                                    <td>{exp.squat}</td>
                                                    <td>{exp.bench}</td>
                                                    <td>{exp.deadlift}</td>
                                                    <td>{exp.snatch}</td>
                                                    <td>{exp.cnj}</td>
                                                    <td>{Number(exp.bench)+Number(exp.squat)+Number(exp.deadlift)}</td>
                                                    <td>{exp.position}</td>
                                                    <td>{exp.location}</td>
                                                    <td>{exp.from}</td>
                                                    <td>{exp.to}</td>
                                                    <td>{exp.Description}</td>
                                                    <td><Button variant='danger' onClick={handleExpDelete.bind(this, exp._id)}>Delete</Button></td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                                :
                                <div className="container">

                                </div>
                            }
                        </>}

                    </div>
            }
        </>
    )
}
