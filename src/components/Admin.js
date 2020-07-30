
import React, { useEffect, useState, useReducer } from 'react';
import '../styles/menu.css';
import styled from 'styled-components'
import { useTable, useBlockLayout, useResizeColumns, usePagination } from 'react-table'
import axios from 'axios';
import '../styles/common.css';
import '../styles/appModalInput.css';
import Select from "react-select";
import AppModal from './helper/AppModal';
import Processing from './helper/processing';


const Styles = styled.div`
  padding: 1rem;
  display: grid;
  overflow: overlay;

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      ${'' /* In this example we use an absolutely position resizer,
       so this is required. */}
      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;

        &.isResizing {
          background: red;
        }
      }
    }
  }
  `

function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
  
    const defaultColumn = React.useMemo(
      () => ({
        minWidth: 30,
        width: 200,
        maxWidth: 300,
      }),
      []
      )
      



    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow
    } = useTable({
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 }
    },
    usePagination,
      useBlockLayout,
      useResizeColumns)
  
    // Render the UI for your table
    return (
      <div {...getTableProps()} className="table" style={{width: "fit-content"}}>
        {/* <div> */}
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map(column => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                  {/* Use column.getResizerProps to hook up the events correctly */}
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                  />
                </div>
              ))}
            </div>
          ))}
        {/* </div> */}
  
        <div {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map(cell => {
                  return (
                    <div {...cell.getCellProps()} className="td">
                      {cell.render('Cell')}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>



      </div>
    )
  }
  
  
  
  const Admin =(props)=>{
    const[data,setData] =  useState([]);
    const[columns,setColumns] =  useState([]);
    const [showModal, setShowModal] = useState({status: ""});
    const [headerMessage, setHeaderMessage] = useState("Add Item In Stock");
    let optionsForUnit=[{ value: "Kg", label: "Kg" },{ value: "Ltr", label: "Ltr" }];
    const [userInput, setUserInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        { item_name : "",
        selectUnit:""
        }
      );
    
      const [error, setError] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
          item_name : "",
        priceForItem: "",
        selectUnit:""
        }
      );

      const handleChange = (evt) => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        console.log("name",name," value ",newValue)
        setUserInput({ [name]: newValue });
        setError({item_name : "",
        selectUnit:""})
      };

      const handleChangeForSelect = ( optionChosen,fieldName) => {
          setUserInput({[fieldName]:optionChosen});
        console.log("name",fieldName," value ",optionChosen);
        
      };
    // let AppModal=()=>()

  useEffect(() => {
            
            
    axios.defaults.baseURL = 'http://localhost:5000';
    let dataEle=[];
    let config = {
      method: 'get',
      url: '/stockManagement',
      withCredentials: true,
    };
    axios(config)
    .then((res)=>{
        console.log("response from stock table",res.data);
        if(res.data.length!==0){

        res.data.map((ele) => {
            // setData([]);
            setData((dataRecord)=>[...dataRecord,ele]);
            // data=[...dataRecord,ele];
        })
        Object.entries(res.data[0]).map(([key,value]) => {
            dataEle={
                Header: () => (
                    <span>
                     <h4>{key}</h4>
                    </span>
                  ),
                accessor: key,
               }

               dataEle=[{
                Header: () => (
                          <span>
                           <h4>SNo.</h4>
                          </span>
                        ),
                      accessor: "s_no",
                    },{
                     Header: () => (
                               <span>
                                <h4>Item Name</h4>
                               </span>
                             ),
                           accessor: "item_name",
                    },{
               
                Header: () => (
                          <span>
                           <h4>Unit</h4>
                          </span>
                        ),
                      accessor: "item_unit"}];
               setColumns(dataEle)
        })}
    })
    .catch((err)=>{
        console.log("error",err);
    })
  
    
  }, [])



    // const csvFilePath='./akhil.csv';

    let readyToSubmit=()=>{
        let errorTestPass = true;
        Object.entries(userInput).map(([key,value])=>{
            if(value === ""){
                errorTestPass=false;
                setError({ [key]: "This field can't be blank" });
            }
            
        })
                if(errorTestPass){
                    setShowModal({status:"processing"});
                    setHeaderMessage("Processing");
                    let config = {
                      method: 'post',
                      url: '/postIntoStockManagement',
                      withCredentials: true,
                      data: {
                        "item_name": userInput.item_name,
                        "item_unit": userInput.selectUnit.value
                    }
                      };
                    axios(config)
        .then((res)=>{
            console.log("response from Stock Mgmt table",res.data);
            if(res.data.status==="done"){

                setShowModal({status:"done"});
                setHeaderMessage("Saved");
                setUserInput({ item_name : "",
                selectUnit:""
                });
            }
            // res.data.map((ele) => {
            //     setData((dataRecord)=>[...dataRecord,ele]);
            //     // data=[...dataRecord,ele];
            // })
        })
                }
        
    }

    let headerOfModal=(message)=>(<div className="modal-header">
    <h4 className="modal-title">{headerMessage}</h4>
   <div className="primary fa fa-times-circle fa-2x cursrPointer btn btn-danger" onClick={()=>{setShowModal({status: ""})}}>
    
    X</div>
    </div>);

    let succesOfModal = (message)=>(<div className="modal-header">
    <h4 className="modal-title alert alert-success">Successfully Added</h4>
   <div className="primary fa fa-times-circle fa-2x cursrPointer btn btn-primary" onClick={()=>{setShowModal({status: ""})
  window.location.reload(false)}}>
    
    OK</div>
    </div>)

    let internalInputCompo=(
    <div className="ak">
        {headerOfModal(headerMessage)}
        {/* <div className="modal-header">
                        <h4 className="modal-title">{headerMessage}</h4>
                       <div className="primary fa fa-times-circle fa-2x cursrPointer" onClick={()=>{setShowModal({status: ""})}}>
                        
                        X</div>
                        </div> */}
    <div className="col-md-12 addIn">
    <label className="fixedDisplay">Item Name:</label>
    <input
      // className="adjustWidth"  
      placeholder="Enter Item Name"
      name="item_name"
      onChange={handleChange}
      value={userInput['item_name']}
      type="text"
    />
    {/* <p className="addIner blinking">{error.item_name} </p> */}
{ error.item_name!=="" ? <p className="addIner blinking alert alert-danger">{error.item_name}</p> :null} 
  </div>

  <div className="col-md-12 addIn">
  <label className="fixedDisplay">Select Units:</label>
<Select
//   className="adjustWidthForMultiSelect"
name="selectUnit"
placeholder="Select Units"
value={userInput.selectUnit}
options={optionsForUnit}
onChange={(chosenOption)=>{
    // handleChange()
    handleChangeForSelect(chosenOption,"selectUnit")}
}
//   onChange={(options) => {
//     handleMultiChange(options, element.textfield);
//     handleChangeForOutput(options, element.textfield);
//   }}
//   isMulti={isMulti}
//   isSearchable={isMulti}
/>
{/* <p className="addIner blinking">{error.selectUnit} </p> */}
{ error.selectUnit!=="" ? <p className="addIner blinking alert alert-danger">{error.selectUnit}</p> :null} 
</div>


 
  <div className="modal-footer">
    <button type="button" className="btn btn-success" onClick={()=>readyToSubmit()} >Submit</button>
    </div>

    </div>);

    let setChangePasswordCompo=()=>{
      props.getResponseFromChild('chanePassword');
    }

let failureModal = (message)=>(<div className="modal-header">
<h4 className="modal-title alert alert-danger">Some Error Occurred!!</h4>
<div className="primary fa fa-times-circle fa-2x cursrPointer btn btn-warning" onClick={()=>
{
   showModal({"status":null})
}}>

OK</div>
</div>)




let content = (
    // <div className="a">
    <div className="card bg-primary mainContent">
    {/* <h1>Home</h1> */}

    {/* onClick={} */}
    <div className="oneMoreFlex">
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
    <div className="toSetAtRightCorner">
    <div className="add forMgmt" onClick={()=>setShowModal({status: "createData"})}>Add Item +</div>
    <div className="add forMgmt" onClick={()=>setChangePasswordCompo()}>Change Password</div>
    {/* onClick={()=>setShowModal({status: "createData"})} */}
    </div>
    </div>
    {showModal.status==="createData" ?  (
        <AppModal componentToLoad={internalInputCompo} ></AppModal>
    ) :null}
    {showModal.status==="processing" ?  (
        <AppModal componentToLoad={<Processing></Processing>} ></AppModal>
    ) :null}
    {showModal.status==="done" ?  (
        <AppModal componentToLoad={succesOfModal} ></AppModal>
    ) :null}
    {showModal.status==="error" ?  (
         <AppModal componentToLoad={failureModal} ></AppModal>
    ) :null}
        </div>


 )

return content;
}

export default Admin