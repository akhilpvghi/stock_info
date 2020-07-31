import React, {useEffect, useState, useRef} from 'react';
import '../styles/store.css'
import Select from "react-select";
import axios from 'axios';
import AppModal from './helper/AppModal';
import Processing from './helper/processing';

const StockManagement =(props)=> {
	const [itemListToAdd, setItemListToAdd] = useState([{"lastUpdatedQty":""}]);
	const [stockInfoData, setStockInfoData] = useState([]);
	const [optionsForItems, setOptionsForItems] = useState([]);
	const [optionsForItemsPersistent, setOptionsForItemsPersistent] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [datasendingStatus, setDatasendingStatus] = useState({"status":null})
	const [error, setError] = useState("");
	const [elementItemLength, setElementItemLength] = useState(0);
	const [buttonDisability, setButtonDisability] = useState(true)
	const [dataProcessedList, setDataProcessedList] = useState([])
	useEffect(() => {
		if(props.stockInfoData.length!==0)
		{
			let countForLastUpdatedItem=0
			setStockInfoData(props.stockInfoData);
			props.stockInfoData.map((ele)=>{
				let objectOfItemsForPrice = {};
				let option={};
				if(ele["is_last_updated"]==="true"){
					countForLastUpdatedItem+=1;
					option={value:ele["item_name"],label:ele["item_name"],item_id:ele["item_id"]};
					objectOfItemsForPrice[ele.item_name]  ="";
					setOptionsForItems((data)=>[...data,option]);
					setOptionsForItemsPersistent((data)=>[...data,option]);
				}
			})
			setElementItemLength(countForLastUpdatedItem);
		}
	}, [])

	let updateToHome=()=>{
		props.getResponseFromChild('updateStockData');
	  }

	let addMoreItemToSupply=()=>{
		let itemLengthOnScreen=elementItemLength;
		itemLengthOnScreen-=1;
		setElementItemLength(itemLengthOnScreen);
		let updatedOptionList=[];
		updatedOptionList=optionsForItemsPersistent;
		itemListToAdd.map((selectedItems)=> {
			updatedOptionList = updatedOptionList.filter((ele)=>selectedItems.item_name!==ele.value); 
		})
		setOptionsForItems(updatedOptionList);
		setItemListToAdd((addedItem)=>[...addedItem,{}]);
	}
	let reduceItemToSupply=(ele,index)=>{
		let itemLengthOnScreen=elementItemLength;
		itemLengthOnScreen+=1;
		setElementItemLength(itemLengthOnScreen);

		let totalPrice=0;
		let reduceCurrArr=[];
		reduceCurrArr=itemListToAdd.filter((elem)=>elem!==ele)
		reduceCurrArr.map((ele)=>{
			totalPrice+=ele["itemTotalPrice"];
			
		})
		
		setItemListToAdd(reduceCurrArr);
		
		setTotalAmount(totalPrice);
	}



	let handleChangeForSelect=(chosenOption,index)=>{
		setError("");
		let arrToUpdate=[...itemListToAdd];
		stockInfoData.map((ele)=>{
			if(ele["item_name"]===chosenOption.value ){
			arrToUpdate[index]={ ["item_name"]: chosenOption.value, ["curr_qty_in_stock"]: ele["curr_qty_in_stock"] , ["item_unit"]:ele["item_unit"], ["item_id"]: ele["item_id"]}
				
			}
		})
		setItemListToAdd(arrToUpdate);
	}

	let handleChange=(evt,index)=>{
		setButtonDisability(false);
		setError("")
		let itemTotalPrice=0;
		let totalPrice=0;
		let arrItemListTosuuply=[...itemListToAdd];
		arrItemListTosuuply[index]["errorForQty"]="";
		arrItemListTosuuply[index]["errorForPrice"]="";
	// 	try{
      
	// 		// else if(evt.target.name==="lastUpdatedQty"){
				
	// 			// 	  stockInfoData.map((toCheckQty)=>{
	// 				// 		  if(toCheckQty["item_name"]===arrItemListTosuuply[index]["item_name"]){
	// 					// 			  if(parseFloat(toCheckQty["curr_qty_in_stock"])<parseFloat(evt.target.value)){
	// 		// 				setButtonDisability(true)
	// 		// 				  arrItemListTosuuply[index]["errorForQty"]=`${arrItemListTosuuply[index]["item_name"]} is only ${toCheckQty["curr_qty_in_stock"]} ${toCheckQty["item_unit"]} in Stock`;
	// 		// 			  }
	// 		// 		  }
	// 		// 	  })
        
	// 		// }
    //   // else if(evt.target.name==="item_per_unit_price"){
		  
    //   // }
	// 	}catch{
	// 	}
    try{
      if(evt.target.name==="lastUpdatedQty"){
		  arrItemListTosuuply[index]["lastUpdatedQty"]=evt.target.value;
		  if(!RegExp("^[0-9]+(?:\.[0-9]+)?$", "g").test(
			evt.target.value)
		   && evt.target.value!=="" ){
			setButtonDisability(true);
			arrItemListTosuuply[index]["errorForQty"]="Enter Valid Qty/Amt.";
		}
		itemTotalPrice = arrItemListTosuuply[index]["item_per_unit_price"]*parseFloat(arrItemListTosuuply[index]["lastUpdatedQty"]);
		}else if(evt.target.name==="item_per_unit_price"){
			arrItemListTosuuply[index]["item_per_unit_price"]=evt.target.value;
			if(!RegExp("^[0-9]+(?:\.[0-9]+)?$", "g").test(
				evt.target.value)
				&& evt.target.value!==""){
					arrItemListTosuuply[index]["errorForPrice"]="Enter Valid Price for Item";
				}
				itemTotalPrice = arrItemListTosuuply[index]["item_per_unit_price"]*parseFloat(arrItemListTosuuply[index]["lastUpdatedQty"]);
			}
			if(evt.target.value==="")
		   setButtonDisability(true);
	}catch{

	}
	arrItemListTosuuply[index]["itemTotalPrice"]=itemTotalPrice;
	arrItemListTosuuply.map((ele) => {
		totalPrice+=ele["itemTotalPrice"];

	})

	
	setTotalAmount(totalPrice);
	setItemListToAdd(arrItemListTosuuply);
	}

// 	let getDate =()=>{
// 		var date = new Date(); 
// 		var d = date.getDate();
// 		var m = date.getMonth() + 1;
// 		var y = date.getFullYear();

// var dateString = (m <= 9 ? '0' + m : m) + '/' +(d <= 9 ? '0' + d : d) + '/'  + y;
// return dateString;
// 	}

	let updateRecord=()=>{
		
		let dataToupdateStock=[];
		// let date = getDate();
		let tempError="";

		// let filtered =[];
		// setError(tempError);
		itemListToAdd.map((ele)=>{
			let newObj={};
			try{
				if(!RegExp("^[0-9]+(?:\.[0-9]+)?$", "g").test(
					ele.lastUpdatedQty
					))
					{
						tempError="Provided Qty/Amt. can't be processed!! Please Check and try Again!!";
						setError(tempError);
						return "";
						
					}
					else if(!RegExp("^[0-9]+(?:\.[0-9]+)?$", "g").test(
						ele.item_per_unit_price
						)){
							tempError="Provided Price for Item can't be processed!! Please Check and try Again!!";
						setError(tempError);
						return "";

					}
					else{
						tempError=ele["errorForPrice"]+ele["errorForPrice"];
					}
				}catch{
				}
					newObj["item_id"]=ele.item_id;
					newObj["item_name"]=ele.item_name;
          newObj["item_unit"]= ele.item_unit;
          newObj["item_per_unit_price"]=ele.item_per_unit_price;
					// newObj["lastUpdatedOn"]= date;
					newObj["lastUpdatedQty"]= ele.lastUpdatedQty.toString();
      dataToupdateStock=[...dataToupdateStock,newObj];
      console.log("ele error",ele["error"]);
		})
		
		console.log("data that is sending=======> ", dataToupdateStock);
		if(tempError===""){
			
			setError("");
			setDatasendingStatus({"status":"processing"});
					let config = {
						method: 'put',
						url: '/addInCurrentStockTable',
						withCredentials: true,
						data: {"items_to_add":dataToupdateStock}
					  };
			axios(config)
			.then((res)=>{
				if(res.data.length!==0)
				{
					//  filtered = res.data.filter(item =>        // filter jsondata
					// 	dataToupdateStock.every( f =>                // so every member of filter array
					// 		 f.value.includes(item[f.item_name])) )

					// res.data.map((el)=>{
					// 	let option={value:el["item_name"],label:el["item_name"],item_id:el["item_id"]};
						
					// 	// const returnedTarget = Object.assign({},(data)=>{...data,...option});
					// 	let data = (data)=>[...data,option]
					// 	setOptionsForItems(data);
					// })
					const filtered = res.data.filter((el) => {
						
						return dataToupdateStock.some((f) => {
						  return f.item_name === el.item_name && f.item_id === el.item_id;
						});
					  });

					  

					console.log("filtered filtered",filtered)

					setDataProcessedList(filtered);
					updateToHome()
					setDatasendingStatus({"status":"done"});
					// setItemListToAdd([{"lastUpdatedQty":"",
					// "item_per_unit_price":""}]);
					// setTotalAmount(0);
					// setStockInfoData(res.data);
					// dataToupdateStock.map((ele,index)=>{
						
					// 	reduceItemToSupply(ele,index)
					// })
		// 			let arrToUpdate=[...filtered];
		// 			arrToUpdate.map((ele,index)=>{
		// 	arrToUpdate[index]={ ["item_name"]: ele.value, ["curr_qty_in_stock"]: ele["curr_qty_in_stock"] , ["item_unit"]:ele["item_unit"], ["item_id"]: ele["item_id"]}
			
		// })
		setStockInfoData(res.data);
					setItemListToAdd([{"lastUpdatedQty":"",
					 "item_per_unit_price":""}])
					 setOptionsForItems(optionsForItemsPersistent)
					setElementItemLength(optionsForItemsPersistent.length);
				}
			}).catch((err)=>{
				setDatasendingStatus({"status":"error"});
				console.log("errr===================>",err);
			})
		}
	}

	let succesOfModal = (message)=>(<div className="modal-header padd0 alert-info">
		{
			dataProcessedList.map((ele)=>{
				return(
					<div class="alert alert-warning" role="alert">
  {/* This is a primary alert—check it out! */}
  {ele['item_name']} is {ele['curr_qty_in_stock']} {ele['item_unit']} in Stock
</div>

					// <h4 >{ele['item_name']} is {ele['curr_qty_in_stock']} {ele['item_unit']} in Stock</h4>
				)
			})
		}
{/* <h4 className="modal-title alert alert-success">Successfully Updated!!!</h4> */}
    {/* <h4 className="modal-title alert alert-success">Successfully Updated!!!</h4> */}
   <div className="primary fa fa-times-circle fa-2x cursrPointer btn btn-primary" onClick={()=>
   {
	   setDatasendingStatus({"status":null})
	// window.location.reload(false)
  }}>
    
	Successfully Updated!!! OK</div>
	</div>)

let failureModal = (message)=>(<div className="modal-header">
<h4 className="modal-title alert alert-danger">Some Error Occurred!!</h4>
<div className="primary fa fa-times-circle fa-2x cursrPointer btn btn-warning" onClick={()=>
{
   setDatasendingStatus({"status":null})
}}>

OK</div>
</div>)
	
let content =(

<div  className="card bg-primary mainContent store">
		<div className="article">
			<table className="meta">
				<tr>
				</tr>
				{/* <tr>
					<th><span >Date</span></th>
					<td><span >{new Date().toDateString()}</span></td>
				</tr> */}
			</table>
			<table className="inventory">
				<thead>
					<tr>
          <th><span >Date</span></th>
						<th><span >Item</span></th>
						{/* <th><span >Description</span></th> */}
						<th><span >Quantity</span></th>
						<th><span >Price</span></th>
						<th><span >Total</span></th>
            <th><span >Current Qty In Stock</span></th>
						<th><span >Total</span></th>
					</tr>
				</thead>
				<tbody>
					{itemListToAdd.map((ele,index)=>{
						return (<tr key={index} >
              <td><div className="cut" onClick={()=>reduceItemToSupply(ele,index)}>-</div><h5 data-prefix>{new Date().toDateString()}</h5></td>
							<td >
							<Select
//   className="adjustWidthForMultiSelect"
name="itemList"
placeholder="Select Units"
value={{value: itemListToAdd[index]["item_name"],label:itemListToAdd[index]["item_name"]}}
options={optionsForItems}
onChange={(chosenOption)=>{	
	// handleChange()
	
    handleChangeForSelect(chosenOption,index)}
} 
/>
</td>
							{/* <td><span >Updating On {new Date().toDateString()}</span></td> */}
              {/* <td><h5 data-prefix>Rs. {itemListToAdd[index]["price"]}</h5></td> */}
							<td>
								<input className="removeContentEditable" type="text" name="lastUpdatedQty" onChange={(evt)=>handleChange(evt,index)} placeholder={`Enter Qty in ${itemListToAdd[index]["item_unit"] ? itemListToAdd[index]["item_unit"] :''}`} value= {itemListToAdd[index]["lastUpdatedQty"]}  />
								{/* {itemListToAdd[index]["qtyMeasure"] ?`Enter in ${itemListToAdd[index]["qtyMeasure"]}`:""} */}
                <p className="addIner blinking m-0">{itemListToAdd[index]["errorForQty"]}</p>
								
								</td>
              <td>
								<input className="removeContentEditable" name="item_per_unit_price" type="text" onChange={(evt)=>handleChange(evt,index)} placeholder={`Enter Price per ${itemListToAdd[index]["item_unit"] ? itemListToAdd[index]["item_unit"] :''}`} value= {itemListToAdd[index]["item_per_unit_price"]}  />
								<p className="addIner blinking m-0">{itemListToAdd[index]["errorForPrice"]}</p>
								{/* {itemListToAdd[index]["qtyMeasure"] ?`Enter in ${itemListToAdd[index]["qtyMeasure"]}`:""} */}
								</td>
							<td><span data-prefix></span><h5> {itemListToAdd[index]["itemTotalPrice"] ?`Rs ${itemListToAdd[index]["itemTotalPrice"]}` : "Enter Valid Qty"}</h5></td>
                <td><h5 data-prefix>{itemListToAdd[index]["curr_qty_in_stock"]} {itemListToAdd[index]["item_unit"]}</h5></td>
							<td><span data-prefix></span><h5> {itemListToAdd[index]["itemTotalPrice"] ?`Rs ${itemListToAdd[index]["itemTotalPrice"]}` : "Enter Valid Qty"}</h5></td>
						</tr>)
					})}
					
				</tbody>
			</table>
			{elementItemLength!==1 ? <div className="add" onClick={()=>addMoreItemToSupply()}>+</div> :null}
			<table className="balance">
				<tr>
					<th><span >Total</span></th>
					<td><h5 data-prefix>Rs. {totalAmount}</h5></td>
				</tr>
				
			</table>
			
			{/* onClick={()=>()} */}
		</div>
			<button type="button" className="btn btn-success" disabled={buttonDisability}  onClick={updateRecord}>Add Items</button>
			{/* <p className="addIner blinking">{error} </p> */}
			{ error!=="" ? <p className="addIner blinking alert alert-danger">{error}</p> :null} 
		
		{datasendingStatus.status==="processing" ?  (
         <AppModal componentToLoad={<Processing></Processing>} ></AppModal>
	) :null}
	{datasendingStatus.status==="done" ?  (
         <AppModal componentToLoad={succesOfModal} ></AppModal>
    ) :null}
	{datasendingStatus.status==="error" ?  (
         <AppModal componentToLoad={failureModal} ></AppModal>
    ) :null}
	</div>
    )
    return content;

    }
export default StockManagement;