
import React, { useEffect, useState } from 'react';
import '../styles/menu.css';
import styled from 'styled-components'
import { useTable, useBlockLayout, useResizeColumns, usePagination } from 'react-table'
// import Papa from 'papaparse'
import Pagination from './helper/pagination';
// import readXlsxFile from 'read-excel-file'
// import csvtojson  from 'csvtojson';
// import * as fs from 'fs';


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
      prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
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
                {/* <h2 className="tr td">sdkja</h2> */}
              </div>
            )
          })}
        </div>


        {/* <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div> */}

      </div>
    )
  }
  
  
  
  const StockInfo =(props)=>{
    const[data,setData] =  useState([]);
    const[columns,setColumns] =  useState([]);

    useEffect(() => {
      let dataEle=[];
      // let datagram=[{
      //   "id":2,
      //   "itemName":"jfdkds",
      //   "qtyMeasure":"Kg",
      //   "currentQtyInStock":"20kg",
      //   "lastSuppliedQty":"rt",
      //   "lastUpdatedOn": "rew"

      // }]
      if(props.stockInfoData.length!=0)
      setData(props.stockInfoData);
      // Object.entries(res.data[0]).map(([key,value]) => {
        
        dataEle=[{
         Header: () => (
                   <span>
                    <h4>SNo.</h4>
                   </span>
                 ),
               accessor: "id",
             },{
              Header: () => (
                        <span>
                         <h4>Item Name</h4>
                        </span>
                      ),
                    accessor: "itemName",
             },{
        
               Header: () => (
                         <span>
                          <h4>Units</h4>
                         </span>
                       ),
                     accessor: "qtyMeasure"},{
        
         Header: () => (
                   <span>
                    <h4>Current Qty. In Stock</h4>
                   </span>
                 ),
               accessor: "currentQtyInStock"},{
         Header: () => (
                   <span>
                    <h4>Last Supplied Qty.</h4>
                   </span>
                 ),
               accessor: "lastSuppliedQty",
        },{
         Header: () => (
                   <span>
                    <h4>Last Updated On</h4>
                   </span>
                 ),
               accessor: "lastUpdatedOn",
        }];
        setColumns(dataEle);

    }, [props])

      
  


    // const csvFilePath='./akhil.csv';
    

let content = (
    <div className="card bg-primary mainContent">
    {/* <h1>Home</h1> */}

    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
        </div>



 )

return content;
}

export default StockInfo