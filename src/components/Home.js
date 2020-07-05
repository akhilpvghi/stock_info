    import React, {useEffect, useState} from 'react';
    import Menu from './Menu';
    import StockInfo from './StockTable';
    const Home = ()=>{
        const navbarElementsFromHome = ["Stock Table", "Stock Management", "Store" , "About"];
        const[componentName,setComponentName]=useState("Home");
        const[component,setComponent] =  useState(null);
        const [collapsed, setCollapsed] = useState(true);

        const getContentFromHome =()=>{
            return(
            <div className="card bg-primary mainContent">
            <div>
            <h1>Home</h1>
                </div>
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

        useEffect(()=>{
            switch (componentName) {
                case 'Stock Table':
                    setComponent(<StockInfo />)
                    break;
                case 'Stock Management':
                    setComponent(<StockInfo />)
                    break;
                case 'Store':
                    setComponent(<StockInfo />)
                    break;
                default:
                        setComponent(null);
                        getContentFromHome();
                    break;
            }
        },[componentName])


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