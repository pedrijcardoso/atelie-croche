/**
 * =====================================================================
 * ARQUIVO: cart.js
 * PASTA: js/modules/
 * =====================================================================
 * Responsável por TODO o estado e a lógica de negócio do carrinho de
 * compras: adicionar, remover, alterar quantidade e calcular totais.
 *
 * Este módulo NÃO manipula o DOM diretamente (separação de
 * responsabilidades) — ele apenas guarda o estado em memória e notifica
 * "ouvintes" (listeners) sempre que o estado muda, para que js/app.js
 * peça ao ui.js para re-renderizar a interface.
 * =====================================================================
 */

// Estado interno do carrinho — não exportado diretamente para evitar
// que outros módulos alterem o array por fora das funções controladas
// abaixo (evita estados inconsistentes / bugs de mutação direta).
let cartItems = [];

// Lista de funções que serão chamadas sempre que o carrinho mudar
const listeners = [];

/**
 * Permite que outros módulos "assinem" mudanças no carrinho.
 * @param {Function} callback - função chamada a cada atualização
 */
export function subscribe(callback) {
  listeners.push(callback);
}

/** Notifica todos os ouvintes inscritos, repassando uma cópia do estado */
function notify() {
  const snapshot = getItems();
  listeners.forEach((callback) => callback(snapshot));
}

/**
 * Adiciona um produto ao carrinho. Se o produto já existir, apenas
 * incrementa a quantidade.
 * @param {{id:string, name:string, price:number, image:string}} product
 */
export function addItem(product) {
  if (!product || typeof product.id !== "string") {
    // Proteção básica contra dados inválidos/malformados
    console.warn("Produto inválido não pôde ser adicionado ao carrinho.");
    return;
  }

  const existing = cartItems.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image,
      quantity: 1,
    });
  }

  notify();
}

/**
 * Remove completamente um item do carrinho pelo id.
 * @param {string} productId
 */
export function removeItem(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  notify();
}

/**
 * Atualiza a quantidade de um item. Quantidades <= 0 removem o item.
 * @param {string} productId
 * @param {number} newQuantity
 */
export function updateQuantity(productId, newQuantity) {
  const item = cartItems.find((i) => i.id === productId);
  if (!item) return;

  if (newQuantity <= 0) {
    removeItem(productId);
    return;
  }

  item.quantity = newQuantity;
  notify();
}

/** Retorna uma cópia (não a referência) da lista de itens do carrinho */
export function getItems() {
  return cartItems.map((item) => ({ ...item }));
}

/** Retorna a quantidade total de peças no carrinho (soma das qty) */
export function getItemCount() {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

/** Retorna o valor total em reais (número) */
export function getTotal() {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

/** Esvazia o carrinho por completo (usado após finalizar o pedido) */
export function clearCart() {
  cartItems = [];
  notify();
}