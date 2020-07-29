import React, {useEffect, useState, useRef} from 'react';
import '../styles/store.css'
import Select from "react-select";
import axios from 'axios';
import AppModal from './helper/AppModal'
import Processing from './helper/processing';

const Store =(props)=> {
	const [itemListToSupplly, setItemListToSupplly] = useState([{"amountToSupply":""}]);
	const [stockInfoData, setStockInfoData] = useState([]);
	const [optionsForItems, setOptionsForItems] = useState([]);
	const [optionsForItemsPersistent, setOptionsForItemsPersistent] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [datasendingStatus, setDatasendingStatus] = useState({"status":null})
	const [error, setError] = useState("");
	const [elementItemLength, setElementItemLength] = useState(0);
	const [buttonDisability, setButtonDisability] = useState(true)
	useEffect(() => {
		if(props.stockInfoData.length!==0)
		{
			let countForLastUpdatedItem=0;
			setStockInfoData(props.stockInfoData);
			props.stockInfoData.map((ele)=>{
				let option={};
				let objectOfItemsForPrice = {};
				if(ele["is_last_updated"]==="true"){
					countForLastUpdatedItem+=1;
				option={value:ele["item_name"],label:ele["item_name"],id:ele["id"]};
				objectOfItemsForPrice[ele.item_name]  ="";
				setOptionsForItems((data)=>[...data,option]);
				setOptionsForItemsPersistent((data)=>[...data,option]);
			}
		})
		setElementItemLength(countForLastUpdatedItem);
		}
	}, [])

	let addMoreItemToSupply=()=>{
		let itemLengthOnScreen=elementItemLength;
		itemLengthOnScreen-=1;
		setElementItemLength(itemLengthOnScreen);
		let updatedOptionList=[];
		updatedOptionList=optionsForItemsPersistent;
		itemListToSupplly.map((selectedItems)=> {
			updatedOptionList = updatedOptionList.filter((ele)=>selectedItems.item_name!==ele.value); 
		})
		setOptionsForItems(updatedOptionList);
		setItemListToSupplly((addedItem)=>[...addedItem,{}]);
	}
	let reduceItemToSupply=(ele,index)=>{
		let itemLengthOnScreen=elementItemLength;
		itemLengthOnScreen+=1;
		setElementItemLength(itemLengthOnScreen);

		let totalPrice=0;
		let reduceCurrArr=[];
		reduceCurrArr=itemListToSupplly.filter((elem)=>elem!==ele)
		reduceCurrArr.map((ele)=>{
			totalPrice+=ele["itemTotalPrice"];
			
		})
		
		setItemListToSupplly(reduceCurrArr);
		
		setTotalAmount(totalPrice);
	}



	let handleChangeForSelect=(chosenOption,index)=>{
		setError("");
		let arrToUpdate=[...itemListToSupplly];
		stockInfoData.map((ele)=>{
			if(ele["item_name"]===chosenOption.value ){
				arrToUpdate[index]={ ["item_id"]:ele["item_id"],["item_name"]: chosenOption.value, ["price"]: ele["price"],["item_unit"]:ele["item_unit"],["amountToSupply"]:"",["curr_qty_in_stock"]:ele.curr_qty_in_stock,["is_last_updated"]:ele.is_last_updated};
				
			}
		})
		setItemListToSupplly(arrToUpdate);
	}

	let handleChange=(evt,index)=>{
		setButtonDisability(false);
		setError("")
		let itemTotalPrice=0;
		let totalPrice=0;
		let arrItemListTosuuply=[...itemListToSupplly];
		arrItemListTosuuply[index]["error"]="";
		try{

			if(!RegExp("^[0-9]+(?:\.[0-9]+)?$", "g").test(
				evt.target.value)
			   && evt.target.value!=""){
				setButtonDisability(true);
				arrItemListTosuuply[index]["error"]="Enter Valid Qty/Amt.";
			   }
			  else {
				  stockInfoData.map((toCheckQty)=>{
					  if(toCheckQty["item_name"]===arrItemListTosuuply[index]["item_name"] && toCheckQty["is_last_updated"]==="true"){
						  if(parseFloat(toCheckQty["curr_qty_in_stock"])<parseFloat(evt.target.value)){
							setButtonDisability(true)
							  arrItemListTosuuply[index]["error"]=`${arrItemListTosuuply[index]["item_name"]} is only ${toCheckQty["curr_qty_in_stock"]} ${toCheckQty["item_unit"]} in Stock`;
						  }
					  }
				  })
			  }
		}catch{
		}
	
	arrItemListTosuuply[index]["amountToSupply"]=evt.target.value;
	try{

		itemTotalPrice = arrItemListTosuuply[index]["price"]*parseFloat(evt.target.value);
	}catch{

	}
	arrItemListTosuuply[index]["itemTotalPrice"]=itemTotalPrice;
	arrItemListTosuuply.map((ele)=>{
		totalPrice+=ele["itemTotalPrice"];

	})

	
	setTotalAmount(totalPrice);
	setItemListToSupplly(arrItemListTosuuply);
	}

// 	let getDate =()=>{
// 		var date = new Date(); 
// 		var d = date.getDate();
// 		var m = date.getMonth() + 1;
// 		var y = date.getFullYear();

// var dateString = (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y;
// return dateString;
// 	}

	let updateRecord=()=>{
		
		let dataToupdateStock=[];
		// let date = getDate();
		let tempError="";
		// setError(tempError);
		itemListToSupplly.map((ele)=>{
			let newObj={};
			// newObj={
				try{
					if(!RegExp("^[0-9]+(?:\.[0-9]+)?$", "g").test(
						ele.amountToSupply
						))
						{
							tempError="Provided Qty/Amt. can't be proceeded!! Please Check and try Again!!";
							setError(tempError);
							return "";
							
						}else{
							tempError=ele["error"];
						}
					}catch{
					}
					
					newObj["item_id"]=ele.item_id;
					newObj["item_name"]=ele.item_name;
					newObj["item_unit"]= ele.item_unit;
					// newObj["lastUpdatedOn"]= date;
					newObj["amountToSupply"]= ele.amountToSupply.toString();
			dataToupdateStock=[...dataToupdateStock,newObj];
		})
		
		console.log("data that is sending=======> ", dataToupdateStock);
		if(tempError===""){
			
			setDatasendingStatus({"status":"processing"});
			setError("");
					let config = {
						method: 'put',
						url: '/updateCurrentStockTable',
						withCredentials: true,
						data: {"itemsToSupply":dataToupdateStock}
					  };
			axios(config)
			.then((res)=>{
				if(res.data['status']=='done')
				setDatasendingStatus({"status":"done"});
			}).catch((err)=>{
				setDatasendingStatus({"status":"error"});
				console.log("errr===================>",err);
			})
		}
	}

	let succesOfModal = (message)=>(<div className="modal-header">
    <h4 className="modal-title alert alert-success">Successfully Updated!!!</h4>
   <div className="primary fa fa-times-circle fa-2x cursrPointer btn btn-primary" onClick={()=>
   {
	   setDatasendingStatus({"status":null})
	window.location.reload(false)
  }}>
    
    OK</div>
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
				<tr>
					<th><span >Date</span></th>
					<td><span >{new Date().toDateString()}</span></td>
				</tr>
			</table>
			<table className="inventory">
				<thead>
					<tr>
						<th><span >Item</span></th>
						<th><span >Description</span></th>
						<th><span >Current Qty In Stock</span></th>
						<th><span >Quantity</span></th>
						{/* <th><span >Price</span></th> */}
					</tr>
				</thead>
				<tbody>
					{itemListToSupplly.map((ele,index)=>{
						return (<tr key={index} >
							<td ><div className="cut" onClick={()=>reduceItemToSupply(ele,index)}>-</div>
							<Select
//   className="adjustWidthForMultiSelect"
name="itemList"
placeholder="Select Units"
value={{value: itemListToSupplly[index]["item_name"],label:itemListToSupplly[index]["item_name"]}}
options={optionsForItems}
onChange={(chosenOption)=>{	
	// handleChange()
	
    handleChangeForSelect(chosenOption,index)}
} 
/>
</td>
							<td><span >Updating On {new Date().toDateString()}</span></td>
							<td><h5 data-prefix> {itemListToSupplly[index]["curr_qty_in_stock"]} {itemListToSupplly[index]["item_unit"]}</h5></td>
							<td>
								<input className="removeContentEditable" type="text" onChange={(evt)=>handleChange(evt,index)} placeholder={itemListToSupplly[index]["item_unit"] ?`Enter in ${itemListToSupplly[index]["item_unit"]}`:""} value= {itemListToSupplly[index]["amountToSupply"]}  />
								<p className="addIner blinking m-0">{itemListToSupplly[index]["error"]}</p>
								
								</td>
							{/* <td><span data-prefix></span><h5> {itemListToSupplly[index]["itemTotalPrice"] ?`Rs ${itemListToSupplly[index]["itemTotalPrice"]}` : "Enter Valid Qty"}</h5></td> */}
						</tr>)
					})}
					
				</tbody>
			</table>
			{elementItemLength!==1 ? <div className="add" onClick={()=>addMoreItemToSupply()}>+</div> :null}
			<table className="balance">
				{/* <tr>
					<th><span >Total</span></th>
					<td><h5 data-prefix>Rs. {totalAmount}</h5></td>
				</tr> */}
				
			</table>
			
			{/* onClick={()=>()} */}
		</div>
			<button type="button" className="btn btn-success" disabled={buttonDisability}  onClick={updateRecord}>Update Record</button>
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
export default Store;