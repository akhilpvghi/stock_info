    import React, {useEffect, useState, useReducer} from 'react';
    import Menu from './Menu';
    import StockManagement from './StockManagement';
    import StockInfo from './StockInfo';
    import Admin from './Admin';
    import axios from 'axios';
import Store from './store';
import AppModal from './helper/AppModal';
import '../styles/appModalInput.css';
import Processing from './helper/processing';
import ChangePassword from './ChangePassword'
// import Cookies from 'universal-cookie';
    const Home = ()=>{
        const navbarElementsFromHome = ["Admin", "Stock Management",  "Stock Info","Store" , "About"];
        const[componentName,setComponentName]=useState("Admin");
        const[component,setComponent] =  useState(null);
        const [collapsed, setCollapsed] = useState(true);
        const[stockInfodata,setStockInfodata] =  useState([]);
        const [showModalObject, setShowModalObject] = useState({"status":null})
        const [isChildDone, setIsChildDone] = useState(false)
        const [isAuthenticated, setIsAuthenticated] = useState(null);
        const [userInput, setUserInput] = useReducer(
            (state, newState) => ({ ...state, ...newState }),
            {username: "",
            password:""}
          );
        
          const [error, setError] = useState("");

        let addItemInStock=(id,itemName,qtyMeasure)=>{
            setShowModalObject({"data":{"id":id,"itemName":itemName,"qtyMeasure":qtyMeasure},"status":"show"});
        }
               
        
        useEffect(() => {
            
            
            axios.defaults.baseURL = 'http://localhost:5000';
            // const cookies = new Cookies();
            // cookies.set('session', 'eyJsb2dnZWRfaW4iOnRydWV9.Xwtm9Q.r8NDvxUywuB7PCD2oRMKeVPADYU; HttpOnly; Path=/', { path: '/' });
            let config = {
                method: 'get',
                url: 'http://localhost:5000/login',
                withCredentials: true,
              };

            axios(config)
        .then((res)=>{
            // console.log("response from authentication isLOgin",res.data);
            if(res.data=="success"){
                setIsAuthenticated(true);
                callbackExpt(res.data.includes("success"),getStockTableData)
                // ;
            }else{
                setIsAuthenticated(false)
            }
        })
        .catch((err)=>{
            setError("Something went wrong!! Try Again!!");
            console.log("error",err);
        })

          },[])
        //   isChildDone


          let getStockTableData=()=>{

            
            axios(
                {
                    method: 'GET',
                    url: `/currentStockTable`,
                    withCredentials: true, 
                }
                )
            .then((res)=>{
                console.log("response from Stock Management",res.data);
                if(res.data!=='fail' && res.data.length!==0){

                    let addHtml=[];
                     res.data.map((ele)=>{
                         let newObj={};
                         newObj={...ele,...{"status":(<div className="add stock_table" onClick={()=>addItemInStock(ele["item_id"],ele["item_name"],ele["item_unit"],)}>Add {ele["item_name"]}</div>),
                                            "lastUpdatedOn":ele["lastUpdatedOn"]  } }
                         addHtml=[...addHtml,newObj];
                    })
                    setStockInfodata(addHtml);
                }else{
                    setIsAuthenticated(false)
                }
            })
            .catch((err)=>{
                console.log("error",err);
            })
            
          }
        

        const getContentFromHome =()=>{
            return(
            <div className="card bg-primary mainContent">
            <h1>Home</h1>
                </div>
                ) 
            }
            
            const handleChange = (evt) => {
                const name = evt.target.name;
                const newValue = evt.target.value;
                console.log("name",name," value ",newValue)
                setUserInput({ [name]: newValue });
                setError("");
            // setError({})
          };
    

        const toggleControl=()=>{
            setCollapsed(!collapsed)
        }
        
        const loadComponent = (data_from_menu) =>{
            setCollapsed((collapsed)=>!collapsed);
            setComponentName(data_from_menu);
            }

            let responseFromChild=(isRefreshRequire)=>{

                if(isRefreshRequire.includes("chanePassword")){
                    setComponent(<ChangePassword username={userInput.username}/>)
                    setComponentName("Change Password");
                }
                // setShowModalObject({...showModalObject,...{"status":null}});
                // if(isRefreshRequire){

                //     window.location.reload(false);
                //     // getStockTableData()
                // }
                // setIsAuthenticated(true)
                console.log("child called in parent",isRefreshRequire);
            }

            let callbackExpt=(status,callback)=>{
                if (status){
                    callback();
                }
            }

            let authenticateUser=(user)=>{

                if(userInput.username!=="" && userInput.password!=""){
                    setIsAuthenticated(null);
                    axios.defaults.baseURL = 'http://localhost:5000';
                    // const cookies = new Cookies();
                    // cookies.set('session', 'eyJsb2dnZWRfaW4iOnRydWV9.Xwtm9Q.r8NDvxUywuB7PCD2oRMKeVPADYU; HttpOnly; Path=/', { path: '/' });
                    let config = {
                        method: 'post',
                        url: 'http://localhost:5000/login',
                        withCredentials: true,
                        // headers: { 
                        //   'Content-Type': 'application/json', 
                        //   'Cookie': cookies.get('session')
                        // //   'session=eyJsb2dnZWRfaW4iOnRydWV9.XwtgTg.H_uWTrMXwFlVkd_CxUKwYamxkvI'
                        // },
                        // headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                        data : {
                            "username": userInput.username,
                            "password": userInput.password
                        }
                      };
    
                    axios(config)
                .then((res)=>{
                    console.log("response from authentication",res.data);
                    if(res.data.includes("success")){
                         console.log('cokkkkkkkkkkiieee  ==>',res.headers);
                         localStorage.setItem("username",userInput.username)
                        setIsAuthenticated(true);
                        callbackExpt(res.data.includes("success"),getStockTableData)
                        // ;
                    }else{
                        setError("Credentials did not match!! Try Again!!");
                        setIsAuthenticated(false)
                    }
                })
                .catch((err)=>{
                    setError("Something went wrong!! Try Again!!");
                    console.log("error",err);
                })
                }else{
                    setError("Field can not be left blank");
                }



                // if(user.username==="akhil" && user.password==="123")
                // setIsAuthenticated(true);
                // else
            }

            let logoutUser=()=>{
                setIsAuthenticated(null);
                setUserInput({
                    username:"",
                    password:""
                })
                let config = {
                    method: 'get',
                    url: '/logout',
                    withCredentials: true
                  };

                axios(config)
            .then((res)=>{
                console.log("response from authentication",res.data);
                if(res.data.includes("success"))
                setIsAuthenticated(false)
            })
        }
        

        useEffect(()=>{
            console.log("is it also called");
            switch (componentName) {
                case 'Stock Management':
                    setComponent(<StockManagement stockInfoData={stockInfodata} />)
                    // showModalHomeObject={showModalObject} getResponseFromChild={responseFromChild}
                    break;
                case 'Admin':
                    setComponent(<Admin getResponseFromChild={responseFromChild}/>)
                    break;
                case 'Stock Info':
                    setComponent(<StockInfo stockInfoData={stockInfodata}/>)
                    break;
                case 'Store':
                        if(stockInfodata.length!=0)
                        setComponent(<Store stockInfoData={stockInfodata}/>)
                        break;
                case 'Change Password':
                    setComponent(<ChangePassword username={userInput.username}/>)
                    break;
                default:
                        setComponent(null);
                        getContentFromHome();
                    break;
            }
        },[componentName,stockInfodata,showModalObject,isChildDone])

        let auth=()=>{

            return (
            
            <div className="a">
                <div className="modal-header">
                <h4 className="modal-title">Authentication Required</h4>
                
            </div>
            <div className="col-md-12 addIn aic">
                   <label className="fixedDisplay">Username</label>
                   <input className="adjustWidth" placeholder="Username"  name="username" onChange ={handleChange}   type="text"/>
                   {/* 
                   <p className="addIner blinking">hello </p>  
                   onChange ={handleChange
                    value={userInput.username}*/
                }
                   </div> 
                   <div className="col-md-12 addIn aic">
                   <label className="fixedDisplay">Password</label>
                   <input className="adjustWidth" placeholder="Password"  name="password" onChange ={handleChange}   type="Password"/>
                   {/* value={userInput.password} onChange ={handleChange} */}
                   </div> 
                   {/* <p className="addIner blinking"></p>  */}
                   <div className="col-md-12 addIn aic" style={{ marginBottom: "10px"}} onClick={()=>authenticateUser()}><button className="fixedDisplay adjustWidth mt-15" >SUBMIT</button></div>
                    { error!=="" ? <p className="addIner blinking alert alert-danger">{error}</p> : null} 
                   {/* onClick={()=>saveToProfileData(userInput)} */}
                   {/* <div className="modal-footer"><button type="button" className="btn btn-danger" onClick={()=>{this.checkShow("close")}} >Close</button>
                      
                          </div> */}
            </div>)
        }


        let content = ()=>
             isAuthenticated  ?  (<div className="wrapper">

            <Menu collapsed={collapsed} navbarElementsFromHome={navbarElementsFromHome} loadComponent={loadComponent}/>
    
            <div id="content" className={`box ${!collapsed ? "" : "active"}`}>
    
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
    
                        <button type="button" id="sidebarCollapse" className="btn btn-info" onClick={()=>toggleControl()}>
                            <i className="fas fa-align-left"></i>
                            <span>Menu</span>
                        </button>
                        <h2 className="alert alert-info">{componentName}</h2>
                    <button className="btn btn-info" onClick={()=>logoutUser()}>Log Out</button>
                    </div>
                </nav>
        {component ? component : getContentFromHome()}
        </div>
        </div>): isAuthenticated==null ?(
                <AppModal componentToLoad={<Processing></Processing>} ></AppModal>
                ):(<AppModal componentToLoad={auth()} ></AppModal>)
        
        let content2=(content())
        
             
        return content2;

    }

    export default Home;