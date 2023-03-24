const markStockSoldBtn = document.querySelectorAll('#markStockSoldBtn');
Array.from(markStockSoldBtn).forEach((element)=>{
    element.addEventListener('click', markStockAsSold);
});

const removeStockBtn = document.querySelectorAll('#removeStockBtn');
Array.from(removeStockBtn).forEach((element)=>{
    element.addEventListener('click', markStockAsSold);
})

async function markStockAsSold(){
    const parentRow = this.parentNode.parentNode.parentNode;
    const _id = parentRow.childNodes[3].innerText;
    let currentPrice = parentRow.childNodes[11].innerText;
    currentPrice = currentPrice.slice(0, currentPrice.lastIndexOf(' '));
    try{
        const response = await fetch('user/markStockAsSold', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              '_id': _id,
              'currentPrice': currentPrice
            })
          });
        const data = await response;
        location.reload();
    }catch(err){
        console.log(err);
    }
}

async function removeStock(){
    const parentRow = this.parentNode.parentNode.parentNode;
    const _id = parentRow.childNodes[3].innerText;
    try{
        const response = await fetch('user/boughtStock', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              '_id': _id,
            })
          });
        const data = await response;
        location.reload();
    }catch(err){
        console.log(err);
    }
}