import React, {useEffect, useState, useRef} from 'react';
import '../styles/store.css'
import Select from "react-select";
import axios from 'axios';
import AppModal from './helper/AppModal'
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
	useEffect(() => {
		if(props.stockInfoData.length!==0)
		{
			setStockInfoData(props.stockInfoData);
			setElementItemLength(props.stockInfoData.length);
			props.stockInfoData.map((ele)=>{
				let option={};
        let objectOfItemsForPrice = {};
        if(ele["is_last_updated"]==="true"){

          option={value:ele["item_name"],label:ele["item_name"],item_id:ele["item_id"]};
          objectOfItemsForPrice[ele.item_name]  ="";
          setOptionsForItems((data)=>[...data,option]);
          setOptionsForItemsPersistent((data)=>[...data,option]);
        }
			})
		}
	}, [])

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
		try{
      if(!RegExp("^[0-9]+(?:\.[0-9]+)?$", "g").test(
				evt.target.value)
			   && evt.target.value!=""){
				setButtonDisability(true);
				arrItemListTosuuply[index]["errorForQty"]="Enter Valid Qty/Amt.";
			   }
      // else if(evt.target.name==="lastUpdatedQty"){
			
			// 	  stockInfoData.map((toCheckQty)=>{
			// 		  if(toCheckQty["item_name"]===arrItemListTosuuply[index]["item_name"]){
			// 			  if(parseFloat(toCheckQty["curr_qty_in_stock"])<parseFloat(evt.target.value)){
			// 				setButtonDisability(true)
			// 				  arrItemListTosuuply[index]["errorForQty"]=`${arrItemListTosuuply[index]["item_name"]} is only ${toCheckQty["curr_qty_in_stock"]} ${toCheckQty["item_unit"]} in Stock`;
			// 			  }
			// 		  }
			// 	  })
        
      // }
      // else if(evt.target.name==="item_per_unit_price"){

      // }
		}catch{
    }
    try{
      if(evt.target.name==="lastUpdatedQty"){
        arrItemListTosuuply[index]["lastUpdatedQty"]=evt.target.value;
      }else if(evt.target.name==="item_per_unit_price"){
        arrItemListTosuuply[index]["item_per_unit_price"]=evt.target.value;
        itemTotalPrice = arrItemListTosuuply[index]["item_per_unit_price"]*parseFloat(arrItemListTosuuply[index]["lastUpdatedQty"]);
      }
	}catch{

	}
	arrItemListTosuuply[index]["itemTotalPrice"]=itemTotalPrice;
	arrItemListTosuuply.map((ele) => {
		totalPrice+=ele["itemTotalPrice"];

	})

	
	setTotalAmount(totalPrice);
	setItemListToAdd(arrItemListTosuuply);
	}

	let getDate =()=>{
		var date = new Date(); 
		var d = date.getDate();
		var m = date.getMonth() + 1;
		var y = date.getFullYear();

var dateString = (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y;
return dateString;
	}

	let updateRecord=()=>{
		
		let dataToupdateStock=[];
		let date = getDate();
		let tempError="";
		// setError(tempError);
		itemListToAdd.map((ele)=>{
			let newObj={};
			// newObj={
				// try{
				// 	// if(!RegExp("^[0-9]+(?:\.[0-9]+)?$", "g").test(
				// 	// 	ele.lastUpdatedQty
				// 	// 	))
				// 	// 	{
				// 	// 		tempError="Provided Qty/Amt. can't be proceeded!! Please Check and try Again!!";
				// 	// 		setError(tempError);
				// 	// 		return "";
							
				// 	// 	}else{
				// 			// tempError=ele["error"];
				// 		// }
				// 	}catch{
        //   }
					
					newObj["item_id"]=ele.item_id;
					newObj["item_name"]=ele.item_name;
          newObj["item_unit"]= ele.item_unit;
          newObj["item_per_unit_price"]=ele.item_per_unit_price;
					newObj["lastUpdatedOn"]= date;
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
				if(res.data.length!=0)
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
								<input className="removeContentEditable" type="text" name="lastUpdatedQty" onChange={(evt)=>handleChange(evt,index)} placeholder={`Enter Qty in ${itemListToAdd[index]["item_unit"]}`} value= {itemListToAdd[index]["lastUpdatedQty"]}  />
								{/* {itemListToAdd[index]["qtyMeasure"] ?`Enter in ${itemListToAdd[index]["qtyMeasure"]}`:""} */}
                <p className="addIner blinking m-0">{itemListToAdd[index]["errorForQty"]}</p>
								
								</td>
              <td>
								<input className="removeContentEditable" name="item_per_unit_price" type="text" onChange={(evt)=>handleChange(evt,index)} placeholder="Enter Price per Kg" value= {itemListToAdd[index]["item_per_unit_price"]}  />
								<p className="addIner blinking m-0">{itemListToAdd[index]["error"]}</p>
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