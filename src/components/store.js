import React, {useEffect, useState, useReducer, useRef} from 'react';
import '../styles/store.css'
import Select from "react-select";

const Store =(props)=> {

	// let currentChosenOption="";
	const [itemListToSupplly, setItemListToSupplly] = useState([{}]);
	const [stockInfoData, setStockInfoData] = useState([]);
	const [optionsForItems, setOptionsForItems] = useState([]);
	const [currentChosenOption, setCurrentChosenOption] = useState("");
	const menu = useRef([]);
	const [mainStateObjectOfStore, setMainStateObjectOfStore] = useState([]);
	const [userInput, setUserInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        { 
        }
	  );
	  
	  const [priceForItem, setpriceForItem] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
        }
      );
    
      const [error, setError] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
        itemName : "",
        priceForItem: "",
        selectUnit:""
        }
      );

	useEffect(() => {
		if(props.stockInfoData.length!==0)
		{
			setStockInfoData(props.stockInfoData);
			props.stockInfoData.map((ele)=>{
				let option={};
				let objectOfItemsForPrice = {};
				let mainObjectOfStore={};
				mainObjectOfStore={"index":0,"itemName": ele["itemName"],"price":ele["itemName"],"isSelected": false, "qtyToSupply":0}
				option={value:ele["itemName"],label:ele["itemName"]};
				objectOfItemsForPrice[ele.itemName]  ="";
				setMainStateObjectOfStore((dataStore)=>[...dataStore,mainObjectOfStore]);
				setOptionsForItems((data)=>[...data,option]);
			})
		}
		// setStockInfoData(props.stockInfoData)
	}, [])

	let addMoreItemToSupply=()=>{
		// let newItem={}
		console.log("addMOreItemCallled   ",itemListToSupplly.length);
		// setItemListToSupplly((addedItem)=>[...addedItem,mainStateObjectOfStore]);
		setItemListToSupplly((addedItem)=>[...addedItem,userInput]);
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
		// setUserInput({ [selectedValue]: chosenOption.value });
		// console.log(" chosenOption chosenOption",chosenOption, currentChosenOption);
		// setCurrentChosenOption(chosenOption.value);
		stockInfoData.map((ele)=>{
			if(ele["itemName"]===chosenOption.value){
				setpriceForItem({ [chosenOption.value]: ele["price"] });
				
	// setCurrentChosenOption(chosenOption.value);
				console.log(" ele[  =======>",ele["price"]);
			}
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
							ref = {el => menu.current[index] = el}
//   className="adjustWidthForMultiSelect"
name={`itemName${index}`}
placeholder="Select Item"
value={{value: ele.itemName,label:userInput.itemName}}
options={optionsForItems}
onChange={(chosenOption)=>{	
	// handleChange()
	
    handleChangeForSelect(chosenOption,index)}
} 
/>
</td>
							<td><span >Updating On {new Date().toDateString()}</span></td>
							<td><span data-prefix>Rs. </span><span >{priceForItem[userInput["itemName"]]}</span></td>
							<td><span >4</span></td>
							<td><span data-prefix>$</span><span>600.00</span></td>
						</tr>)
					})}
					
				</tbody>
			</table>
			<div class="add" onClick={()=>addMoreItemToSupply()}>+</div>
			<table class="balance">
				<tr>
					<th><span >Total</span></th>
					<td><span data-prefix>$</span><span>600.00</span></td>
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
		</div>
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