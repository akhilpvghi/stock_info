
import React, { useState, useEffect } from 'react';
import '../styles/menu.css'


const Menu =(props)=>{

const [collapsed, setCollapsed] = useState(true);

const getLink=(event)=>{
    props.loadComponent(event);
}

useEffect(() => {
        setCollapsed(props.collapsed)
}, [props])

let content = (<nav id="sidebar" className={`${!collapsed ? "" : "active"}`}>
<div className="sidebar-header">
    <h3>STOCK INFO</h3>
</div>

<ul className="list-unstyled components">
    {/* <p>Admin</p> */}
    {props.navbarElementsFromHome ? props.navbarElementsFromHome.map((ele,index)=>{
                return ( <li key={index} onClick={()=>getLink(ele)}>
                    <a>{ele}</a>
                </li>)} ):null}
  
</ul>

{/* <ul className="list-unstyled CTAs">
    <li>
        <a href="https://bootstrapious.com/tutorial/files/sidebar.zip" className="download">Download Excel</a>
    </li>
</ul> */}
</nav>

)

return content;
}

export default Menu;