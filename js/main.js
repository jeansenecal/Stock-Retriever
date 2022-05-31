
document.querySelector('#retrieveBtn').addEventListener('click', retrieveStock);

async function retrieveStock(){
	const stock = document.querySelector("#stockName").value;  
	const res = await fetch('/api?stock=' + stock);
	const data = await res.json();
	if( !data.err){
		document.querySelector("#name").textContent = "Name: " + data.name;
  		document.querySelector("#price").textContent = "Price: " + data.price + " USD";
  		document.querySelector("#exchange").textContent = "Exchange: " + data.exchange;
	}else{
		document.querySelector("#name").textContent = "Error: " + data.err;
	}
	
}