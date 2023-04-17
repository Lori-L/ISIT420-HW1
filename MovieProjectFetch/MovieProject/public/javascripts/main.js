
//let orderArray = [];
let storeArray = [98053, 98007, 98077, 98055, 98011, 98046];
let CdArray = [123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];

// define a constructor to create order objects
let OrderObject = function (pStore, pSalesPerson, pCd, pPrice, pDate) {
    this.StoreID = pStore;  
    this.SalesPersonID = pSalesPerson;
    this.CdID = pCd;
    this.PricePaid = pPrice;
    this.Date = pDate;
}

document.addEventListener("DOMContentLoaded", function () {


// add button events ************************************************************************
    
    document.getElementById("buttonSubmitOne").addEventListener("click", function () {
        let newOrder = createOrder();

        fetch('/AddOrder', {
            method: "POST",
            body: JSON.stringify(newOrder),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json()) 
            .then(json => console.log(json))
            .catch(err => console.log(err));
    
    });

    document.getElementById("buttonSubmit500").addEventListener("click", function(){
        let orderArray = [];
        let dateAddition = 0;

        for (let i = 0; i < 500; i++) { //Generates 500 orders
            orderArray.push(createOrder());
        }

        orderArray.forEach(order => { //Changes dates on orders past 1
            order.Date += dateAddition;

            dateAddition += Math.floor((Math.random() * 25001) + 5000); //Between 5000 and 30000
        });

        console.log(orderArray);

        fetch('/AddOrders500', {
            method: "POST",
            body: JSON.stringify(orderArray),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json()) 
            .then(json => console.log(json))
            .catch(err => console.log(err));
    });

    document.getElementById("buttonCreate").addEventListener("click", function () {
        sampleOrder = createOrder();
        updateOrderDisplay(sampleOrder);    
    });

  
    document.getElementById("buttonRepProfit").addEventListener("click", function() {
        // update local array from server
        
        fetch('/getMoneyBySalesRep')
        // Handle success
        .then(response => response.json())  // get the data out of the response object
        .then( responseData => fillUL(responseData, "Rep "))    //update our array and li's
        .catch(err => console.log('Request Failed', err)); // Catch errors
    });

    document.getElementById("buttonCdSales").addEventListener("click", function() {
        // update local array from server
        
        fetch('/getSaleNumbersPerCd')
        // Handle success
        .then(response => response.json())  // get the data out of the response object
        .then( responseData => fillUL(responseData, "CD "))    //update our array and li's
        .catch(err => console.log('Request Failed', err)); // Catch errors
    });

});  
// end of wait until document has loaded event  *************************************************************************

//Creates and returns one random order. Order date is the time of creation.
function createOrder(){ 
    let randStore = storeArray[Math.floor(Math.random() * storeArray.length)];
    let randCD = CdArray[Math.floor(Math.random() * CdArray.length)];
    let randPrice = Math.floor((Math.random() * 11) + 5); //Between 5 and 15
    let tempDate = Date.now();
    let randSalesPerson;

    switch(randStore){ //Assigns a sales person according to the store
        case 98053:
            randSalesPerson = Math.floor((Math.random() * 4) + 1); //Between 1 and 4
            break;
        case 98007:
            randSalesPerson = Math.floor((Math.random() * 4) + 5); //Between 5 and 8
            break;
        case 98077:
            randSalesPerson = Math.floor((Math.random() * 4) + 9); //Between 9 and 12
            break;
        case 98055:
            randSalesPerson = Math.floor((Math.random() * 4) + 13); //Between 13 and 16
            break;
        case 98011:
            randSalesPerson = Math.floor((Math.random() * 4) + 17); //Between 17 and 20
            break;
        case 98046:
            randSalesPerson = Math.floor((Math.random() * 4) + 21); //Between 21 and 24
            break;
    }
    
    newOrder = new OrderObject(randStore, randSalesPerson, randCD, randPrice, tempDate);
    return newOrder;
}
  
function updateOrderDisplay(sampleOrder){
    document.getElementById("sampleStore").innerHTML = "StoreID: " + sampleOrder.StoreID;
    document.getElementById("sampleSalesPerson").innerHTML = "SalesPersonID: "+sampleOrder.SalesPersonID;
    document.getElementById("sampleCd").innerHTML = "CdID: "+sampleOrder.CdID;
    document.getElementById("samplePrice").innerHTML = "PricePaid: "+sampleOrder.PricePaid;
    document.getElementById("sampleDate").innerHTML = "Date: "+sampleOrder.Date;
}

function fillUL(data, subject) {
    let orderArray = data;
    console.log(orderArray);
        // clear prior data
    var divQueryResults = document.getElementById("divQueryResults");
    while (divQueryResults.firstChild) {    // remove any old data so don't get duplicates
        divQueryResults.removeChild(divQueryResults.firstChild);
    };

    var ul = document.createElement('ul');
   
    orderArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = subject + element._id + " earned " +
                        "$" + element.totalPrice
        ul.appendChild(li);
    });
    divQueryResults.appendChild(ul);
}