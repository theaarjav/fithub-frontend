import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swol from 'sweetalert2'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const UserRegister=()=> {
    const navigate=useNavigate();

    const [user, setuser] = useState({
        email:"",
        password:"",
        name:""
    })

    const [userErr, setuserErr]= useState({
        emailErr:true,
        passErr:true,
        nameErr:true
    })

    const validateEmail=(e)=>{
        setuser({...user, email:e.target.value})
        // console.log(user.email)
        let regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    !regExp.test(e.target.value)
      ? setuserErr({ ...userErr, emailErr: true })
      : setuserErr({ ...userErr, emailErr: false});
    //   console.log(userErr.emailErr)
    }
    const validateName=(e)=>{
        setuser({...user, name:e.target.value});
        if (e.target.value.split(" ").join("") === "")
      setuserErr({ ...userErr, nameErr: true });
    else setuserErr({ ...userErr, nameErr: false });
        // console.log(user.name)
    }
    const validatepass=(e)=>{
        setuser({...user, password:e.target.value})
        if (e.target.value.split(" ").join("") === "")
      setuserErr({ ...userErr, passErr: true });
    else setuserErr({ ...userErr, passErr: false });
        // console.log(user.password)
    }


    const handleSubmit= async (e)=>{
        e.preventDefault();
        if(userErr.nameErr || userErr.passErr || userErr.emailErr){
            return Swol.fire("Enter valid credentials", "", "error");
        }
        let email=user.email;
        let name=user.name;
        let password=user.password;
        let userRegister={name, email, password}
        let {status, data}= await axios.post("https://maestrohub-backend.onrender.com/api/user/register", userRegister, {headers: {'Content-Type': 'application/json'}});
        if(status===201){
            Swol.fire(data.msg," ","error");
        }
        else if(status===200){
            Swol.fire(data.msg, "", "success");
            // localStorage.setItem("maestrohub", data.token)
            navigate('/user/login');

        }else{
            Swol.fire("Someting Went Wrong, Please Try Again","","warning")
        }
    }
    useEffect(() => {
      if(localStorage.getItem('maestrohub'))return navigate('/')
    
    }, [])
    
  return (
    <Form className='container' style={{
        margin:"3vh auto"
    }}>
      <Form.Group className="mb-3" controlId="formBasicEmail" >
        <Form.Label>Email address</Form.Label>
        {/* <small className='danger'>err</small> */}
        <Form.Control type="email" placeholder="Enter email" onChange={validateEmail}/>
        <Form.Text className="text-danger text-opacity-75">
          {userErr.emailErr?"Please Enter a valid email":""}
        </Form.Text>
      </Form.Group>
        <Form.Group>

        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" onChange={validateName}/>
        <Form.Text className="text-danger text-opacity-75">
          {userErr.nameErr?"Please Enter a valid Name":""}
        </Form.Text>
        </Form.Group>
        

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={validatepass}/>
        <Form.Text className="text-danger text-opacity-75">
          {userErr.passErr?"Please Enter a valid password":""}
        </Form.Text>
      </Form.Group>
      {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
  );
}
