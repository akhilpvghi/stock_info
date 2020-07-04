import React from 'react';
import Menu from './Menu'
const Home = ()=>{
    const navbarElementsFromHome = ["Home", "About me", "Experience" , "Hobbies" , "Get in touch", "Downloads","Games"];
      
    let content = (
    <div >
        {/* <h3>Home</h3> */}
        {/* className="home" */}
        <Menu navbarElements={navbarElementsFromHome} />
        {/* loadComponent={loadComponent} */}

    </div> )
    return content;

}

export default Home;