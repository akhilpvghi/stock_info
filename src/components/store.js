import React, {useEffect, useState, useReducer, useRef} from 'react';
import '../styles/store.css'
import Select from "react-select";
import axios from 'axios';

const Store =(props)=> {

	// let currentChosenOption="";
	const [itemListToSupplly, setItemListToSupplly] = useState([{}]);
	const [stockInfoData, setStockInfoData] = useState([]);
	const [optionsForItems, setOptionsForItems] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [dataToSend, setDataToSend] = useState([]);
	const menu = useRef([]);

	// const [mainStateObjectOfStore, setMainStateObjectOfStore] = useState([]);
	// const [userInput, setUserInput] = useReducer(
    //     (state, newState) => ({ ...state, ...newState }),
    //     { 
    //     }
	//   );
	  
	//   const [priceForItem, setpriceForItem] = useReducer(
    //     (state, newState) => ({ ...state, ...newState }),
    //     {
    //     }
    //   );
    
    //   const [error, setError] = useReducer(
    //     (state, newState) => ({ ...state, ...newState }),
    //     {
    //     itemName : "",
    //     priceForItem: "",
    //     selectUnit:""
    //     }
    //   );

	useEffect(() => {
		if(props.stockInfoData.length!==0)
		{
			setStockInfoData(props.stockInfoData);
			props.stockInfoData.map((ele)=>{
				let option={};
				let objectOfItemsForPrice = {};
				let mainObjectOfStore={};
				mainObjectOfStore={"index":0,"itemName": ele["itemName"],"price":ele["itemName"],"isSelected": false, "qtyToSupply":0}
				option={value:ele["itemName"],label:ele["itemName"],id:ele["id"]};
				objectOfItemsForPrice[ele.itemName]  ="";

				// setMainStateObjectOfStore((dataStore)=>[...dataStore,mainObjectOfStore]);
				setOptionsForItems((data)=>[...data,option]);
			})
		}
		// setStockInfoData(props.stockInfoData)
	}, [])

	let addMoreItemToSupply=()=>{
		// let newItem={}
		let toRemoveFromOptions = optionsForItems;

		itemListToSupplly.map((ele)=>console.log("current items",ele.itemName));

	// 	let updatedOptionList = optionsForItems.filter((OptionItems)=>{
		let updatedOptionList=[];
		itemListToSupplly.map((selectedItems)=> {
			 updatedOptionList = optionsForItems.filter((ele)=>ele.value!==selectedItems.itemName)
		})
	//    })

	// 	// let updatedOptionList = toRemoveFromOptions.filter((el)=>el.value!==chosenOption.value);
		setOptionsForItems(updatedOptionList);
		console.log("addMOreItemCallled   ",itemListToSupplly.length);
		// setItemListToSupplly((addedItem)=>[...addedItem,mainStateObjectOfStore]);
		setItemListToSupplly((addedItem)=>[...addedItem,{}]);
	}
	let reduceItemToSupply=()=>{
		// let newItem={}
		console.log("addMOreItemCallled   ",itemListToSupplly.length);
		// setItemListToSupplly(itemListToSupplly.filter(item => item.name !== name));
	}



	let handleChangeForSelect=(chosenOption,index)=>{
		console.log("menu see ===========>  ",menu.current[index]);
		let arrToUpdate=[...itemListToSupplly];
		
		
		// arrToUpdate[index]
		// console.log(" chosenOption chosenOption",chosenOption, currentChosenOption);
		// setCurrentChosenOption(chosenOption.value);
		stockInfoData.map((ele)=>{
			if(ele["itemName"]===chosenOption.value ){
				arrToUpdate[index]={ ["itemName"]: chosenOption.value, ["price"]: ele["price"],["id"]:ele["id"],["qtyMeasure"]:ele["qtyMeasure"]};
				console.log(" ele[  =======>",ele["price"]);
			}
			// && Object.keys(arrToUpdate[index]).length==0
			// else if(ele["itemName"]===chosenOption.value){
			// 	let prevArray=itemListToSupplly;
			// 	prevArray.filter((ele)=>ele.itemName!=arrToUpdate[index].itemName)
				
			// }
		})
		setItemListToSupplly(arrToUpdate);
	}

	let handleChange=(chars,index)=>{
		let itemTotalPrice=0;
		let totalPrice=0;
		let arrItemListTosuuply=[...itemListToSupplly];
		let qty=parseInt(chars);
		itemTotalPrice = arrItemListTosuuply[index]["price"]*qty;
		if(qty!==NaN)
		arrItemListTosuuply[index]["amountToSupply"]=qty;
		arrItemListTosuuply[index]["itemTotalPrice"]=itemTotalPrice;
		arrItemListTosuuply.map((ele)=>{
			totalPrice+=ele["itemTotalPrice"];

		})

		
		setTotalAmount(totalPrice);
		setItemListToSupplly(arrItemListTosuuply);
	}

	// useEffect(() => {
		
	// }, [itemListToSupplly])


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
		itemListToSupplly.map((ele)=>{
			let newObj={};
			// newObj={
				newObj["id"]=ele.id;
				newObj["itemName"]=ele.itemName;
				newObj["qtyMeasure"]= ele.qtyMeasure;
            	newObj["lastUpdatedOn"]= date;
            	newObj["amountToSupply"]= ele.amountToSupply.toString();

			// };
			// setDataToSend([(dataTobeSent)=>[...dataTobeSent,newObj]]);
			dataToupdateStock=[...dataToupdateStock,newObj];
			// console.log("newObj that is sending=======> ", newObj);
			// setDataToSend([...dataToSend,newObj])
		})

		console.log("data that is sending=======> ", dataToupdateStock);

		axios.put('/updateCurrentStockTable',{"itemsToSupply":dataToupdateStock})
		.then((res)=>{
			console.log("resssssssss======>",res.data);
		})
	}

let content =(

<div  className="card bg-primary mainContent store">
		{/* <div className="header">
			<h1>Invoice</h1>
			<div className="address" >
				<p>Jonathan Neal</p>
				<p>101 E. Chapman Ave<br />Orange, CA 92866</p>
				<p>(800) 555-1234</p>
			</div>
			<span><img alt="" src="http://www.jonathantneal.com/examples/invoice/logo.png" /><input type="file" accept="image/*" /></span>
		</div> */}
		<div className="article">
			{/* <h1>Recipient</h1>
			<div className="address" >
				<p>Some Company<br />c/o Some Guy</p>
			</div> */}
			<table class="meta">
				<tr>
					{/* <th><span >Invoice #</span></th>
					<td><span >101138</span></td> */}
				</tr>
				<tr>
					<th><span >Date</span></th>
					<td><span >{new Date().toDateString()}</span></td>
				</tr>
				{/* <tr>
					<th><span >Amount Due</span></th>
					<td><span id="prefix" >$</span><span>600.00</span></td>
				</tr> */}
			</table>
			<table class="inventory">
				<thead>
					<tr>
						<th><span >Item</span></th>
						<th><span >Description</span></th>
						<th><span >Rate</span></th>
						<th><span >Quantity</span></th>
						<th><span >Price</span></th>
					</tr>
				</thead>
				<tbody>
					{itemListToSupplly.map((ele,index)=>{
						return (<tr key={index} >
							<td ><div class="cut" onClick={()=>reduceItemToSupply()}>-</div>
							<Select
//   className="adjustWidthForMultiSelect"
name="itemList"
placeholder="Select Units"
value={{value: itemListToSupplly[index]["itemName"],label:itemListToSupplly[index]["itemName"]}}
options={optionsForItems}
onChange={(chosenOption)=>{	
	// handleChange()
	
    handleChangeForSelect(chosenOption,index)}
} 
/>
</td>
							<td><span >Updating On {new Date().toDateString()}</span></td>
							<td><h5 data-prefix>Rs. {itemListToSupplly[index]["price"]}</h5></td>
							<td>
								{/* <input placeholder="Qty" type="text"/> */}
								<h5 contentEditable onInput={(e)=>handleChange(e.currentTarget.textContent,index)}>0</h5>
								</td>
							<td><span data-prefix></span><h5> {itemListToSupplly[index]["itemTotalPrice"] ?`Rs ${itemListToSupplly[index]["itemTotalPrice"]}` : "Enter Valid Qty"}</h5></td>
						</tr>)
					})}
					
				</tbody>
			</table>
			{optionsForItems.length!==0 ? <div class="add" onClick={()=>addMoreItemToSupply()}>+</div> :null}
			<table class="balance">
				<tr>
					<th><span >Total</span></th>
					<td><h5 data-prefix>Rs. {totalAmount}</h5></td>
				</tr>
				{/* <tr>
					<th><span >Amount Paid</span></th>
					<td><span data-prefix>$</span><span >0.00</span></td>
				</tr> */}
				{/* <tr>
					<th><span >Balance Due</span></th>
					<td><span data-prefix>$</span><span>600.00</span></td>
				</tr> */}
			</table>
			
			{/* onClick={()=>()} */}
		</div>
			<button type="button" className="btn btn-success"  onClick={updateRecord}>Update Record</button>
		{/* <aside>
			<h1><span >Additional Notes</span></h1>
			<div >
				<p>A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
			</div>
		</aside> */}
	</div>
    )
    return content;

    }
export default Store;