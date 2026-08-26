let cartItems=[];const listeners=[];export function subscribe(callback){listeners.push(callback)}
function notify(){const snapshot=getItems();listeners.forEach((callback)=>callback(snapshot))}
export function addItem(product){if(!product||typeof product.id!=="string"){console.warn("Produto inválido não pôde ser adicionado ao carrinho.");return}
const existing=cartItems.find((item)=>item.id===product.id);if(existing){existing.quantity+=1}else{cartItems.push({id:product.id,name:product.name,price:Number(product.price)||0,image:product.image,quantity:1,})}
notify()}
export function removeItem(productId){cartItems=cartItems.filter((item)=>item.id!==productId);notify()}
export function updateQuantity(productId,newQuantity){const item=cartItems.find((i)=>i.id===productId);if(!item)return;if(newQuantity<=0){removeItem(productId);return}
item.quantity=newQuantity;notify()}
export function getItems(){return cartItems.map((item)=>({...item}))}
export function getItemCount(){return cartItems.reduce((total,item)=>total+item.quantity,0)}
export function getTotal(){return cartItems.reduce((total,item)=>total+item.price*item.quantity,0)}
export function clearCart(){cartItems=[];notify()}
