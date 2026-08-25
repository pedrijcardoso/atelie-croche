/**
 * =====================================================================
 * ARQUIVO: app.js
 * PASTA: js/
 * =====================================================================
 * Orquestrador principal da aplicação. Importa os módulos (dados,
 * carrinho, whatsapp e ui) e conecta os eventos de interface,
 * seguindo o princípio de responsabilidade única: cada módulo cuida
 * de uma parte do sistema, e este arquivo apenas os "liga".
 * =====================================================================
 */

import { products } from "./data/products.js";
import * as cart from "./modules/cart.js";
import * as whatsapp from "./modules/whatsapp.js";
import * as ui from "./modules/ui.js";

// ---------- REFERÊNCIAS AOS ELEMENTOS DO DOM ----------
const productGrid = document.getElementById("product-grid");
const cartItemsContainer = document.getElementById("cart-items");
const cartToggleBtn = document.getElementById("cart-toggle");
const cartCloseBtn = document.getElementById("cart-close");
const cartOverlay = document.getElementById("cart-overlay");
const checkoutBtn = document.getElementById("checkout-btn");
const customOrderBtn = document.getElementById("custom-order-btn");
const contactWhatsappBtn = document.getElementById("contact-whatsapp-btn");
const currentYearEl = document.getElementById("current-year");

/**
 * Sempre que o estado do carrinho mudar (adicionar, remover, alterar
 * quantidade), esta função é chamada automaticamente (ver
 * cart.subscribe abaixo) e atualiza toda a interface relacionada.
 */
function handleCartChange(items) {
  const total = cart.getTotal();
  const count = cart.getItemCount();

  ui.renderCartItems(cartItemsContainer, items, {
    onRemove: (id) => cart.removeItem(id),
    onQuantityChange: (id, qty) => cart.updateQuantity(id, qty),
  });

  ui.updateCartCount(count);
  ui.updateCartTotal(total);
  ui.setCheckoutEnabled(items.length > 0);
}

/** Inicializa a aplicação: renderiza produtos e liga os eventos */
function init() {
  // Renderiza o catálogo de produtos, passando a ação de adicionar
  // ao carrinho como callback (inversão de controle)
  ui.renderProducts(productGrid, products, (product) => {
    cart.addItem(product);
  });

  // Sempre que o carrinho mudar, a UI reage automaticamente
  cart.subscribe(handleCartChange);
  handleCartChange(cart.getItems()); // renderização inicial (carrinho vazio)

  // ---------- EVENTOS DO CARRINHO (ABRIR / FECHAR) ----------
  cartToggleBtn.addEventListener("click", ui.openCartDrawer);
  cartCloseBtn.addEventListener("click", ui.closeCartDrawer);
  cartOverlay.addEventListener("click", ui.closeCartDrawer);

  // Acessibilidade: fecha o carrinho ao pressionar a tecla Esc
  document.addEventListener("keydown", (event) => {
    const drawer = document.getElementById("cart-drawer");
    if (event.key === "Escape" && !drawer.hidden) {
      ui.closeCartDrawer();
    }
  });

  // ---------- CHECKOUT VIA WHATSAPP ----------
  checkoutBtn.addEventListener("click", () => {
    const items = cart.getItems();
    const total = cart.getTotal();

    if (items.length === 0) return;

    // A mensagem é montada e sanitizada dentro de whatsapp.js
    // (encodeURIComponent aplicado à mensagem final antes da URL)
    whatsapp.openCheckoutMessage(items, total);
  });

  // ---------- BOTÃO "PEDIR PEÇA PERSONALIZADA EXCLUSIVA" ----------
  // O href="#" no HTML é apenas um fallback estático; o comportamento
  // real (mensagem pré-formatada e segura) é controlado aqui via JS,
  // sobrescrevendo a navegação padrão do link com preventDefault().
  customOrderBtn.addEventListener("click", (event) => {
    event.preventDefault();
    whatsapp.openCustomOrderMessage();
  });

  // ---------- BOTÃO DE CONTATO GERAL (SEÇÃO "FALE CONOSCO") ----------
  contactWhatsappBtn.addEventListener("click", (event) => {
    event.preventDefault();
    whatsapp.openGeneralContactMessage();
  });

  // ---------- ANO ATUAL NO RODAPÉ ----------
  currentYearEl.textContent = String(new Date().getFullYear());
}

// Inicia a aplicação assim que o DOM estiver pronto.
// Como o script é carregado com type="module", ele já é
// automaticamente adiado (defer) até o HTML estar parseado,
// mas o listener abaixo garante robustez em qualquer cenário.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}