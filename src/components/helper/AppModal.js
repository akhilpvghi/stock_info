 import React, { useState, useEffect }from 'react';

  const AppModal =(props)=>{

    const [componentToLoad, setComponentToLoad] = useState(null);
    
    useEffect(() => {
      if(props.componentToLoad)
      setComponentToLoad(props.componentToLoad)
      
    }, [props])
  
  const content =(


    <div className="col-md-12 Appmodal padd0"> 
        <div  id="myModal">
          <div className="modal-dialog incWidth">
              <div className="modal-content incWidth controlOverflow">
                {componentToLoad ?  componentToLoad : null }

                

                </div>
                </div>
                </div>
                </div>
                
  ) ;
           return content;
  }
  
  export default AppModal;