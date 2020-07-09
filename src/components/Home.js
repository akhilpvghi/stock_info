    import React, {useEffect, useState} from 'react';
    import Menu from './Menu';
    import StockInfo from './StockTable';
    import StockManagement from './StockManagement';
    import axios from 'axios';
import Store from './store';
    const Home = ()=>{
        const navbarElementsFromHome = ["Stock Table", "Stock Management", "Store" , "About"];
        const[componentName,setComponentName]=useState("Stock Table");
        const[component,setComponent] =  useState(null);
        const [collapsed, setCollapsed] = useState(true);
        const[stockInfodata,setStockInfodata] =  useState([]);
        const [showModalObject, setShowModalObject] = useState({"status":null})
        const [isChildDone, setIsChildDone] = useState(false)

        let addItemInStock=(id,itemName,qtyMeasure)=>{
            setShowModalObject({"data":{"id":id,"itemName":itemName,"qtyMeasure":qtyMeasure},"status":"show"});
            // console.log("yehi call horha h ",itemName);
        }
               
        
        useEffect(() => {
            console.log("MAIN API called");
            let res;
            if(stockInfodata.length==0){
            axios.defaults.baseURL = 'http://localhost:5000';
            axios.get('/currentStockTable')
            .then((res)=>{
                console.log("response from stock table",res.data);
                // res=res.data;
                let addHtml=[];
                
                 res.data.map((ele)=>{
                     let newObj={};
                     ele["status"]=(<div class="add">+</div>)
                     newObj={...ele,...{"status":(<div class="add stock_table" onClick={()=>addItemInStock(ele["id"],ele["itemName"],ele["qtyMeasure"],)}>Fill Stock For {ele["itemName"]}</div>)} }
                     addHtml=[...addHtml,newObj];
                    // addHtml=[...newObj,{"status":(<div class="add">+</div>)}]
                })
                // {"status":(<div class="add">+</div>)}
                setStockInfodata(addHtml);
                // console.log("stockInfoData={data}   ",res);
            })
            .catch((err)=>{
                console.log("error",err);
            })
            
        }
          }, [isChildDone])
        

        const getContentFromHome =()=>{
            return(
            <div className="card bg-primary mainContent">
            <h1>Home</h1>
                </div>
                ) 
        }

        const toggleControl=()=>{
            setCollapsed(!collapsed)
        }
        
        const loadComponent = (data_from_menu) =>{
            setCollapsed((collapsed)=>!collapsed);
            setComponentName(data_from_menu);
            }

            let responseFromChild=(evt)=>{
                setShowModalObject({...showModalObject,...{"status":""}});
                window.location.reload(false);
                // setComponentName("home");
                // // setComponentName("Stock Table");
                // // setStockInfodata(stockInfodata);
                // setIsChildDone(true);
                // return isChildDone;
                console.log("child called in parent",evt);
            }

        useEffect(()=>{
            console.log("is it also called");
            switch (componentName) {
                case 'Stock Table':
                    setComponent(<StockInfo stockInfoData={stockInfodata} showModalHomeObject={showModalObject} getResponseFromChild={responseFromChild}/>)
                    // stockInfoData={data}
                    break;
                case 'Stock Management':
                    setComponent(<StockManagement />)
                    break;
                case 'Store':
                    if(stockInfodata.length!=0)
                    setComponent(<Store stockInfoData={stockInfodata}/>)
                    break;
                default:
                        setComponent(null);
                        getContentFromHome();
                    break;
            }
        },[componentName,stockInfodata,showModalObject,isChildDone])


        let content = (<div className="wrapper">
        <Menu collapsed={collapsed} navbarElementsFromHome={navbarElementsFromHome} loadComponent={loadComponent}/>

        <div id="content" className={`box ${!collapsed ? "" : "active"}`}>

            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">

                    <button type="button" id="sidebarCollapse" className="btn btn-info" onClick={()=>toggleControl()}>
                        <i className="fas fa-align-left"></i>
                        <span>Menu</span>
                    </button>
                    <h2>{componentName}</h2>
                    {/* <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-align-justify"></i>
                    </button> */}
                </div>
            </nav>
    {component ? component : getContentFromHome()}
            {/* <h2>Collapsible Sidebar Using Bootstrap 4</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <div className="line"></div>

            <h2>Lorem Ipsum Dolor</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <div className="line"></div>

            <h2>Lorem Ipsum Dolor</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

            <div className="line"></div>

            <h3>Lorem Ipsum Dolor</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> */}
        </div>
    </div> )
        return content;

    }

    export default Home;