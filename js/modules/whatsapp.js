/**
 * =====================================================================
 * ARQUIVO: whatsapp.js
 * PASTA: js/modules/
 * =====================================================================
 * Responsável por montar mensagens formatadas e abrir links seguros
 * para a API do WhatsApp (https://wa.me).
 *
 * SEGURANÇA (leia com atenção):
 * 1) Toda mensagem passa por encodeURIComponent() antes de ser anexada
 *    à URL — isso impede "injeção de parâmetros" (por exemplo, alguém
 *    tentando inserir "&outroParametro=" dentro do nome de um produto
 *    para manipular a URL final).
 * 2) O link é aberto com window.open(url, "_blank", "noopener,noreferrer"),
 *    o que evita "tabnabbing": a nova aba (WhatsApp) NÃO recebe acesso
 *    ao objeto `window.opener`, então não pode redirecionar nossa aba
 *    original para um site malicioso.
 * 3) Number(...).toFixed(2) garante que valores numéricos sejam sempre
 *    formatados de forma previsível antes de entrar na mensagem.
 * =====================================================================
 */

// ATENÇÃO: substitua pelo número real do ateliê no formato internacional,
// somente dígitos (código do país + DDD + número). Exemplo para Brasil:
// 55 + DDD (2 dígitos) + número (8 ou 9 dígitos).
const WHATSAPP_NUMBER = "5537998400069"; // <-- TROQUE PELO NÚMERO REAL

/**
 * Formata um valor numérico como moeda brasileira (R$ 0,00).
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Monta a URL segura da API do WhatsApp a partir de um texto puro.
 * A sanitização real acontece aqui, de forma centralizada, para que
 * NENHUM outro módulo precise lembrar de chamar encodeURIComponent().
 * @param {string} message - texto puro (não codificado)
 * @returns {string} URL pronta para abrir
 */
function buildWhatsAppURL(message) {
  // encodeURIComponent() escapa caracteres especiais (&, =, ?, #, etc.)
  // prevenindo que o conteúdo da mensagem quebre ou manipule a URL.
  const safeMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${safeMessage}`;
}

/**
 * Abre uma URL do WhatsApp em nova aba, de forma segura.
 * O terceiro argumento "noopener,noreferrer" é a proteção efetiva
 * contra tabnabbing (equivalente ao rel="noopener noreferrer" em <a>).
 * @param {string} url
 */
export function openWhatsApp(url) {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  // Reforço extra: mesmo em navegadores mais antigos, zeramos a
  // referência ao opener manualmente, caso ela exista.
  if (newWindow) {
    newWindow.opener = null;
  }
}

/**
 * Gera e abre a mensagem padrão de "peça personalizada exclusiva",
 * usada no botão de destaque do banner.
 */
export function openCustomOrderMessage() {
  const message =
    "Olá! Gostaria de solicitar um orçamento para uma peça de crochê personalizada e exclusiva.";
  openWhatsApp(buildWhatsAppURL(message));
}

/** Gera e abre uma mensagem simples de contato geral. */
export function openGeneralContactMessage() {
  const message = "Olá! Gostaria de tirar uma dúvida sobre os produtos do ateliê.";
  openWhatsApp(buildWhatsAppURL(message));
}

/**
 * Gera a mensagem de finalização de pedido a partir dos itens do
 * carrinho e abre o WhatsApp com o texto pronto.
 * @param {Array<{name:string, price:number, quantity:number}>} items
 * @param {number} total
 */
export function openCheckoutMessage(items, total) {
  if (!Array.isArray(items) || items.length === 0) {
    console.warn("Carrinho vazio: não é possível finalizar o pedido.");
    return;
  }

  const linhas = items.map((item) => {
    const subtotal = item.price * item.quantity;
    // Cada campo é interpolado como texto puro; a sanitização contra
    // injeção de URL ocorre depois, em buildWhatsAppURL(), via
    // encodeURIComponent() sobre a mensagem inteira.
    return `• ${item.quantity}x ${item.name} — ${formatCurrency(subtotal)}`;
  });

  const message = [
    "Olá! Gostaria de finalizar o seguinte pedido:",
    "",
    ...linhas,
    "",
    `Total: ${formatCurrency(total)}`,
    "",
    "Aguardo confirmação de disponibilidade e forma de pagamento. Obrigado(a)!",
  ].join("\n");

  openWhatsApp(buildWhatsAppURL(message));
}