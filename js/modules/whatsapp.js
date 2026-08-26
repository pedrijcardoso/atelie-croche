const WHATSAPP_NUMBER="5537991440673";function formatCurrency(value){return value.toLocaleString("pt-BR",{style:"currency",currency:"BRL",})}
function buildWhatsAppURL(message){const safeMessage=encodeURIComponent(message);return `https://wa.me/${WHATSAPP_NUMBER}?text=${safeMessage}`}
export function openWhatsApp(url){const newWindow=window.open(url,"_blank","noopener,noreferrer");if(newWindow){newWindow.opener=null}}
export function openCustomOrderMessage(){const message="Olá! Gostaria de solicitar um orçamento para uma peça de crochê personalizada e exclusiva.";openWhatsApp(buildWhatsAppURL(message))}
export function openGeneralContactMessage(){const message="Olá! Gostaria de tirar uma dúvida sobre os produtos do ateliê.";openWhatsApp(buildWhatsAppURL(message))}
export function openCheckoutMessage(items,total){if(!Array.isArray(items)||items.length===0){console.warn("Carrinho vazio: não é possível finalizar o pedido.");return}
const linhas=items.map((item)=>{const subtotal=item.price*item.quantity;return `• ${item.quantity}x ${item.name} — ${formatCurrency(subtotal)}`});const message=["Olá! Gostaria de finalizar o seguinte pedido:","",...linhas,"",`Total: ${formatCurrency(total)}`,"","Aguardo confirmação de disponibilidade e forma de pagamento. Obrigado(a)!",].join("\n");openWhatsApp(buildWhatsAppURL(message))}
