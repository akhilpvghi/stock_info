function GetSortOrder(prop,isIntSorting) {    

    return function(alpha, beta) {    
        let a=alpha[prop];
        let b=beta[prop];
        if(isIntSorting){
            a=parseInt(alpha[prop]);
            b=parseInt(beta[prop]);
        }
        if (a > b) {    
            return 1;    
        } else if (a < b) {    
            return -1;    
        }    
        return 0;    
    }    
}   

export default GetSortOrder;