import React, {useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import '../styles/common.css'
import '../styles/stockInfo.css';
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components'
import { useTable, useBlockLayout, useResizeColumns, usePagination } from 'react-table'
import axios from 'axios';
import AppModal from './helper/AppModal';
import Processing from './helper/processing';
import GetSortOrder from './helper/getSorting';

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

const StockInfo =(props)=> {

    const [startDate, setStartDate] = useState()
    // const [stockInfoData, setStockInfoData] = useState([])
    const [dataSendingStatus, setDataSendingStatus] = useState({"status":null})
    const [tableData, setTableData] = useState([])
    const[columns,setColumns] =  useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    let getDate =(dateChng)=>{
		var date = new Date(dateChng); 
		var d = date.getDate();
		var m = date.getMonth() + 1;
		var y = date.getFullYear();

var dateString = (m <= 9 ? '0' + m : m) + '/' +(d <= 9 ? '0' + d : d) + '/'  + y;
return dateString;
	}



    let handleChange=(date)=>{
      let price =0;
      let modifyData=[];
        console.log(getDate(date));
        setStartDate(date)
        setDataSendingStatus({"status":"processing"});
        let config = {
          method: 'get',
          url: `/getDataByDate?date_to_check=${getDate(date)}`,
          withCredentials: true,
        };
        axios(config)
        .then((res)=>{
          console.log("res.data stockklinfo",res.data);
          if(res.data.length!==0){
            modifyData =res.data.sort(GetSortOrder("s_no",true));
            modifyData =modifyData.sort(GetSortOrder("item_name",false));
            // GetSortOrder()
            
            // res.data.sort(function (a, b) {
            //   return a.s_no.localeCompare((b['s_no']));
          //   modifyData.sort(function(a, b) {
          //       return parseInt(a.item_name) < parseInt(b.item_name);
            
          // })
            setTableData(modifyData)
            setDataSendingStatus({"status":null}); 
            res.data.map((ele)=>{
              if(ele['action'].includes("reduced")){

                price+=ele['item_per_unit_price']*ele['curr_qty_in_stock']
              }
              else{
                price+=ele['item_per_unit_price']*ele['lastUpdatedQty']

              }
            })
            setTotalAmount(price);
          }else{
            setTableData([])
            setTotalAmount(0);

            setDataSendingStatus({"status":"noRecord"}); 
          }
          
        })
        .catch((err)=>{
          setDataSendingStatus({"status":"error"}); 

    })
        // setTableData(stockInfoData.filter((ele)=>{
        //     return ele.lastUpdatedOn===getDate(date)
        // }))



        

           let dataEle=[
            //  {
            // Header: () => (
            //           <span>
            //            <h4>SNo.</h4>
            //           </span>
            //         ),
            //       accessor: "s_no",
            //     },
                {
                 Header: () => (
                           <span>
                            <h4>Item Name</h4>
                           </span>
                         ),
                       accessor: "item_name",
                },
                {
                    Header: () => (
                              <span>
                               <h4>Price</h4>
                              </span>
                            ),
                          accessor: "item_per_unit_price",
                   },{
                    Header: () => (
                              <span>
                               <h4>Last Updated Qty</h4>
                              </span>
                            ),
                          accessor: "lastUpdatedQty",
                   },
                
                   {
                     
                     Header: () => (
                       <span>
                       <h4>Current Qty in Stock</h4>
                      </span>
                    ),
                    accessor: "curr_qty_in_stock"},
                             {
                                 Header: () => (
                                           <span>
                                            <h4>Last Updated On</h4>
                                           </span>
                                         ),
                                       accessor: "lastUpdatedOn",
                                },
                
                ]

                  setColumns(dataEle);

    }

    

let failureModal = ()=>(<div className="modal-header">
<h4 className="modal-title alert alert-danger">Some Error Occurred!!</h4>
<div className="primary fa fa-times-circle fa-2x cursrPointer btn btn-warning" onClick={()=>
{
   setDataSendingStatus({"status":null})
}}>

OK</div>
</div>)

let succesOfModal = ()=>(<div className="modal-header">
    <h4 className="modal-title alert alert-success">No Records Found!!</h4>
   <div className="primary fa fa-times-circle fa-2x cursrPointer btn btn-primary" onClick={()=>
   {
	   setDataSendingStatus({"status":null})
  }}>
    
    OK</div>
	</div>)
    // useEffect(() => {
    //     if(props.stockInfoData.length!==0){
    //         console.log("props in stockInfo Naew==>",props.stockInfoData)
    //         setStockInfoData(props.stockInfoData)
    //     }
    // }, [props.stockInfoData])

    let content = (<div className="card bg-primary mainContent">
        <div className="stockInfoNew">
       <label forname="date">Select Date: </label>
        <DatePicker
        id="date"
        dateFormat="MM/dd/yyyy"
        selected={startDate}
        onChange={handleChange}
        // dateFormat="Pp" //to show time
      />
        {/* <h3>Stock info</h3> */}
        <Styles>
      <Table columns={columns} data={tableData} />
    </Styles>
    <table className="balance">
				<tr>
					<th><span >Total</span></th>
					<td><h5 data-prefix>Rs. {totalAmount}</h5></td>
				</tr>
				
			</table>
    {dataSendingStatus.status==="processing" ?  (
         <AppModal componentToLoad={<Processing></Processing>} ></AppModal>
	) :null}
	{dataSendingStatus.status==="error" ?  (
         <AppModal componentToLoad={failureModal} ></AppModal>
    ) :null}
    {dataSendingStatus.status==="noRecord" ?  (
         <AppModal componentToLoad={succesOfModal} ></AppModal>
    ) :null}
        </div>
    </div> )

return content;
}

export default StockInfo;