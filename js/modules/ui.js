/**
 * =====================================================================
 * ARQUIVO: ui.js
 * PASTA: js/modules/
 * =====================================================================
 * Responsável por TODA a manipulação do DOM: renderizar produtos,
 * renderizar itens do carrinho, atualizar contador e total, abrir/
 * fechar o drawer do carrinho.
 *
 * SEGURANÇA — ANTI-XSS (leia com atenção):
 * Nunca usamos `innerHTML` com dados dinâmicos (nomes de produtos,
 * preços etc.). Sempre que precisamos inserir TEXTO no DOM, usamos
 * `textContent`, que trata qualquer conteúdo como texto puro — mesmo
 * que contenha caracteres como <, >, " ou script tags, eles NUNCA são
 * interpretados como HTML/JS. Elementos são criados via
 * `document.createElement()` e montados via `appendChild`, nunca via
 * concatenação de strings HTML.
 * =====================================================================
 */

/**
 * Função utilitária de sanitização de texto, usada como camada extra
 * de segurança sempre que um texto dinâmico precisar, em algum cenário
 * futuro, ser inserido como atributo ou reaproveitado como string HTML.
 * Ela escapa os caracteres especiais de HTML manualmente.
 * @param {string} str
 * @returns {string}
 */
export function sanitizeText(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Formata número como moeda brasileira (R$ 0,00) */
function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Placeholder de imagem gerado 100% via SVG embutido (data URI).
 * Evita qualquer requisição a serviços externos de imagem, reduzindo
 * a superfície de ataque e melhorando a performance (zero requests).
 */
const IMAGE_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#F1E4D0"/>
      <text x="50%" y="50%" font-family="Georgia, serif" font-size="60"
        text-anchor="middle" dominant-baseline="middle">🧶</text>
    </svg>`
  );

/**
 * Substitui a imagem por um placeholder seguro caso o arquivo real
 * não seja encontrado (evita ícone de "imagem quebrada" no navegador).
 * @param {Event} event
 */
function handleImageError(event) {
  event.target.src = IMAGE_PLACEHOLDER;
  event.target.onerror = null; // evita loop caso o placeholder também falhe
}

/**
 * Renderiza o grid de produtos no container informado.
 * @param {HTMLElement} container
 * @param {Array} products - lista vinda de js/data/products.js
 * @param {Function} onAddToCart - callback(product) ao clicar em "Adicionar"
 */
export function renderProducts(container, products, onAddToCart) {
  // Limpa o container de forma segura (sem innerHTML = "")
  container.replaceChildren();

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-card__image-wrap";

    const img = document.createElement("img");
    img.className = "product-card__image";
    img.src = product.image;
    // textContent-safe: alt é definido via propriedade, não via HTML
    img.alt = `Foto do produto: ${product.name}`;
    img.loading = "lazy"; // performance: carregamento adiado das imagens
    img.addEventListener("error", handleImageError);
    imageWrap.appendChild(img);

    const body = document.createElement("div");
    body.className = "product-card__body";

    const name = document.createElement("h3");
    name.className = "product-card__name";
    name.textContent = product.name; // seguro contra XSS

    const desc = document.createElement("p");
    desc.className = "product-card__desc";
    desc.textContent = product.description; // seguro contra XSS

    const price = document.createElement("p");
    price.className = "product-card__price";
    price.textContent = formatCurrency(product.price);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "product-card__add-btn";
    addBtn.textContent = "Adicionar ao Carrinho";
    addBtn.setAttribute("aria-label", `Adicionar ${product.name} ao carrinho`);
    addBtn.addEventListener("click", () => {
      onAddToCart(product);
      // Micro-feedback visual acessível ao usuário
      addBtn.textContent = "Adicionado ✓";
      addBtn.classList.add("is-added");
      setTimeout(() => {
        addBtn.textContent = "Adicionar ao Carrinho";
        addBtn.classList.remove("is-added");
      }, 1200);
    });

    body.append(name, desc, price, addBtn);
    card.append(imageWrap, body);
    container.appendChild(card);
  });
}

/**
 * Renderiza a lista de itens dentro do drawer do carrinho.
 * @param {HTMLElement} container
 * @param {Array} items - itens vindos de cart.getItems()
 * @param {{onRemove:Function, onQuantityChange:Function}} handlers
 */
export function renderCartItems(container, items, handlers) {
  container.replaceChildren();

  if (items.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "cart-empty";
    emptyMsg.id = "cart-empty-msg";
    emptyMsg.textContent = "Seu carrinho está vazio.";
    container.appendChild(emptyMsg);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const img = document.createElement("img");
    img.className = "cart-item__image";
    img.src = item.image;
    img.alt = `Foto do produto: ${item.name}`;
    img.addEventListener("error", handleImageError);

    const info = document.createElement("div");
    info.className = "cart-item__info";

    const name = document.createElement("p");
    name.className = "cart-item__name";
    name.textContent = item.name; // seguro contra XSS

    const meta = document.createElement("div");
    meta.className = "cart-item__meta";

    const qtyControls = document.createElement("div");
    qtyControls.className = "cart-item__qty-controls";

    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "cart-item__qty-btn";
    minusBtn.textContent = "−";
    minusBtn.setAttribute("aria-label", `Diminuir quantidade de ${item.name}`);
    minusBtn.addEventListener("click", () => handlers.onQuantityChange(item.id, item.quantity - 1));

    const qtyValue = document.createElement("span");
    qtyValue.textContent = item.quantity;
    qtyValue.setAttribute("aria-live", "polite");

    const plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "cart-item__qty-btn";
    plusBtn.textContent = "+";
    plusBtn.setAttribute("aria-label", `Aumentar quantidade de ${item.name}`);
    plusBtn.addEventListener("click", () => handlers.onQuantityChange(item.id, item.quantity + 1));

    qtyControls.append(minusBtn, qtyValue, plusBtn);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "cart-item__remove";
    removeBtn.textContent = "Remover";
    removeBtn.setAttribute("aria-label", `Remover ${item.name} do carrinho`);
    removeBtn.addEventListener("click", () => handlers.onRemove(item.id));

    meta.append(qtyControls, removeBtn);
    info.append(name, meta);

    const subtotal = document.createElement("p");
    subtotal.className = "cart-item__subtotal";
    subtotal.textContent = formatCurrency(item.price * item.quantity);

    row.append(img, info, subtotal);
    container.appendChild(row);
  });
}

/** Atualiza o número exibido no ícone do carrinho (cabeçalho) */
export function updateCartCount(count) {
  const el = document.getElementById("cart-count");
  el.textContent = String(count); // textContent = seguro contra XSS
}

/** Atualiza o valor total exibido no rodapé do drawer */
export function updateCartTotal(total) {
  const el = document.getElementById("cart-total-value");
  el.textContent = formatCurrency(total);
}

/** Habilita ou desabilita o botão de finalizar compra */
export function setCheckoutEnabled(enabled) {
  const btn = document.getElementById("checkout-btn");
  btn.disabled = !enabled;
}

/** Abre o drawer do carrinho + overlay, com suporte a acessibilidade */
export function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const toggleBtn = document.getElementById("cart-toggle");

  drawer.hidden = false;
  overlay.hidden = false;
  toggleBtn.setAttribute("aria-expanded", "true");

  // Move o foco para o botão de fechar, ajudando usuários de leitores
  // de tela e navegação por teclado (boa prática de acessibilidade)
  document.getElementById("cart-close").focus();
}

/** Fecha o drawer do carrinho + overlay */
export function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const toggleBtn = document.getElementById("cart-toggle");

  drawer.hidden = true;
  overlay.hidden = true;
  toggleBtn.setAttribute("aria-expanded", "false");
  toggleBtn.focus();
}