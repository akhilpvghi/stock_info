
import React, { useState, useReducer } from 'react';
import '../styles/common.css'
import '../styles/appModalInput.css';
import AppModal from './helper/AppModal';
import Processing from './helper/processing';
import axios from 'axios';


const ChangePassword =(props)=>{

    const [showModal, setShowModal] = useState({"status":null});
    const [userInput, setUserInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {password:"",
        newPassword:"",
        rePassword:""
    }
      );
      const [error, setError] = useState("");

      
    //   const [error, setError] = useState(initialState)



    const handleChange = (evt) => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        console.log("name",name," value ",newValue)
        setUserInput({ [name]: newValue });
        
        setError("");
    // setError({})
  };
  
  let changePassword=()=>{
    let testPass=false;
    console.log(userInput["password"],userInput.newPassword,userInput.rePassword)
    if(userInput.password!=="" && userInput.newPassword!=="" &&  userInput.rePassword!==""){
        if( userInput.newPassword!==userInput.rePassword)

            setError("Repeated password did not match with new password");
        
        else

            testPass=true;
        
    }else{
        setError("Field can not be left blank");
    }

    if(testPass){

        setShowModal({"status": "processing"});
          let username=localStorage.getItem("username")
        let config = {
            method: 'put',
            url: '/changePassword',
            data: {
                "username": username,
                "currentPassword": userInput.password,
                "newPassword": userInput.newPassword
            },
            withCredentials: true,
          };
          axios(config)
          .then((res)=>{
            if(res.data.includes("success")){
    
                setShowModal({"status": "success"})
            }
            else{

                setShowModal({"status": null})
                setError("Credential did not match!!");
            }
          })
          .catch((err)=>console.log("err",err))
    }
  }

  let succesOfModal = (message)=>(<div className="modal-header">
    <h4 className="modal-title alert alert-warning">Password Changed Successfuly!!</h4>
   <div className="primary fa fa-times-circle fa-2x cursrPointer btn btn-primary" onClick={()=>{setShowModal({status: null})
  window.location.reload(false)}}>
    
    OK</div>
    </div>)


  let content1=(
  <div className="changePassword">
      <div className="modal-header">
                <h4 className="modal-title alert alert-info">Hello {localStorage.getItem("username")}!! fill credential to change password</h4>
                
            </div>
  <div className="col-md-12 addIn aic">
  <label className="fixedDisplay">Current Password</label>
  <input className="adjustWidth" placeholder="Enter Current Password" value={userInput.password}  name="password" onChange ={handleChange}   type="Password"/>
 
  </div> 
  <div className="col-md-12 addIn aic">
  <label className="fixedDisplay">New Password</label>
  <input className="adjustWidth" placeholder="Enter New Password" value={userInput.newPassword}  name="newPassword" onChange ={handleChange}   type="Password"/>
  {/* value={userInput.password} onChange ={handleChange} */}
  </div> 
  <div className="col-md-12 addIn aic">
  <label className="fixedDisplay">Repeat New Password</label>
  <input className="adjustWidth" placeholder="Re-enter New Password" value={userInput.rePassword}  name="rePassword" onChange ={handleChange}   type="Password"/>
  {/* value={userInput.password} onChange ={handleChange} */}
  </div> 
  {/* <p className="addIner blinking"></p>  */}
  <div className="col-md-12 addIn aic" style={{ marginBottom: "10px"}} onClick={()=>changePassword(userInput)}><button className="fixedDisplay adjustWidth mt-15" >SUBMIT</button></div>
   {/* <p className="addIner blinking">{}</p>   */}
   { error!=="" ? <p className="addIner blinking alert alert-danger">{error}</p> :null} 
  {/* onClick={()=>saveToProfileData(userInput)} */}
  <div className="modal-footer">
  {/* <button type="button" className="btn btn-danger" onClick={()=>{this.checkShow("close")}} >Close</button> */}
         </div>
         </div>
         );


let content = (
    // <div  className="card bg-primary mainContent store"></div>
    // <div className="card bg-primary mainContent ">
    <div className="changePassword">

        <AppModal componentToLoad={content1} ></AppModal>
        {showModal.status==="processing" ?  (
            <AppModal componentToLoad={<Processing></Processing>} ></AppModal>
        ) :null}

{showModal.status==="success" ?  (
    <AppModal componentToLoad={succesOfModal} ></AppModal>
) :null}
    </div>



    // <AppModal componentToLoad={<Processing></Processing>} ></AppModal>
        
            // </div>


)

return content;
}

export default ChangePassword;