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
        }
               
        
        useEffect(() => {
            // console.log("MAIN API called");
            // setShowModalObject({"status":"show"});
            if(stockInfodata.length==0){
            axios.defaults.baseURL = 'http://localhost:5000';
            axios.get('/currentStockTable')
            .then((res)=>{
                console.log("response from stock table",res.data);
                let addHtml=[];
                
                 res.data.map((ele)=>{
                     let newObj={};
                     ele["status"]=(<div className="add">+</div>)
                     newObj={...ele,...{"status":(<div className="add stock_table" onClick={()=>addItemInStock(ele["id"],ele["itemName"],ele["qtyMeasure"],)}>Fill Stock For {ele["itemName"]}</div>)} }
                     addHtml=[...addHtml,newObj];
                })
                setStockInfodata(addHtml);
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

            let responseFromChild=(isRefreshRequire)=>{

                setShowModalObject({...showModalObject,...{"status":null}});
                if(isRefreshRequire)
                window.location.reload(false);
                console.log("child called in parent",isRefreshRequire);
            }

        useEffect(()=>{
            console.log("is it also called");
            switch (componentName) {
                case 'Stock Table':
                    setComponent(<StockInfo stockInfoData={stockInfodata} showModalHomeObject={showModalObject} getResponseFromChild={responseFromChild}/>)
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
                </div>
            </nav>
    {component ? component : getContentFromHome()}
    </div>
    </div> )
        return content;

    }

    export default Home;