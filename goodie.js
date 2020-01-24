//Author: Oskar


async function getPagesCount(){ //Funkcja zwraca ile jest stron z zamowieniami
    const url = "https://goodie.pl/cashback/Transactions?transactionStatus=1&pageIndex=200&pageSize=20"
    let response = await fetch(url);
    let data = await response.json();
    return data.numberOfPages;
}

async function getOrders(page){  //Funkcja zwraca zamowienia na danej stronie
    const url = "https://goodie.pl/cashback/Transactions?transactionStatus=1&pageIndex=" + page + "&pageSize=20"
    let response = await fetch(url)
    let data = await response.json();
    return data.components;
}

function isDateLongerThan60Days(date){
    if(Date.now()-Date.parse(date)>5184000000){ //5184000000 - 60 dni w milisekundach
        // console.log("Ponad 60 dni!")
        return true;
    }
    else{
        return false;
    }

}

function createClaim(order,token){
    let data = {
        complaintType: 2,
        transactionId: order.id,
        brandId: "ca9f9961-0ecb-4a73-b3ec-db51226daeec", //aliexpress
        orderId: order.orderId,
        cashbackAmount: order.returnedAmountValue,
        purchaseAmount: order.purchaseAmountValue,
        transactionDate: null,
        description: "Dzien dobry, testuje API i skarze sie ze nie dostalem cashbacku za zamowienie sprzed pol roku :<"
    }

    fetch("https://goodie.pl/cashback/CreateClaim",
    {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            "__RequestVerificationToken":token,
          },
        body: JSON.stringify(data)
    })
    .then(resp =>{
        console.log(resp)
    })
}

function getToken(){ //Pobieranie tokenu ze scriptu z HTMLa
    let scripts = document.getElementsByTagName("script");
    for(const script of scripts){
        try{
                var tokenScript = script.outerHTML;
                var regExPattern =  /"ajaxAction":"\/cashback\/CreateClaim","ajaxMethod":1,"initialData":false,"requestValidationToken"/;
                var startPosition = regExPattern.exec(tokenScript).index;
                var tokenFragment = tokenScript.substring(startPosition,startPosition + 260);
                var endJSONIndex = /}/.exec(tokenFragment).index +1;
                var tokenString = '{' + tokenScript.substring(startPosition,startPosition+endJSONIndex);
                var tokenJSON = JSON.parse(tokenString);
                var token = tokenJSON.requestValidationToken
                return token;
        }
        catch(err){}
    };
}

async function main(){
    let token = getToken()
    let lastPage = await getPagesCount();
    for(let i = 0; i<35; i++){
        let listOfOrders = await getOrders(lastPage-i);
        console.log(listOfOrders)
        listOfOrders.forEach(order => {
            if(isDateLongerThan60Days(order.date)){
                if(order.canCreateComplaint){ //Sprawdza czy reklamacja nie została już złożona
                    createClaim(order,token);
                }
            }
        });
    }
}
main();

