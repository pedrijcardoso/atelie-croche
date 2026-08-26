/**
 * =====================================================================
 * ARQUIVO: products.js
 * PASTA: js/data/
 * =====================================================================
 * Fonte única de dados dos produtos do ateliê.
 *
 * IMPORTANTE (segurança): estes dados são estáticos e definidos por nós
 * (dados confiáveis). Mesmo assim, toda a exibição desses campos no DOM
 * passa por sanitização em js/modules/ui.js (uso de textContent e da
 * função sanitizeText()), como boa prática — o mesmo pipeline de
 * renderização seria seguro mesmo se os dados viessem futuramente de
 * uma API externa ou de um CMS.
 *
 * Campo "image": aponte para o caminho real da foto do produto dentro
 * de assets/images/. Caso o arquivo não exista, a UI aplica automati-
 * camente uma imagem de placeholder (SVG embutido via data URI, sem
 * requisições externas) — ver js/modules/ui.js -> handleImageError().
 * =====================================================================
 */

export const products = [
  {
    id: "sousplat-duas-cores",
    name: "Sousplat 2 Cores",
    description: "Feito com fio ecológico, 85% algodão e 15% outras fibras. Tamanho da peça: 31cm aprox.",
    price: 25,
    image: "assets/sousplat2cores.jpg",
  },
  {
    id: "bolsa-estrela-do-mar",
    name: "Bolsa de Estrela do Mar",
    description: "Feito com fio ecológico, 85% algodão, 15% outras fibras e fio 100% algodão. Tamanho da peça: 29cm (largura) x 31cm (altura) aprox.",
    price: 60,
    image: "assets/bolsaestreladomar.jpg",
  },
  {
    id: "tapete-oval",
    name: "Tapete Oval Rústico",
    description: "Tapete tecido em fio de trapilho, perfeito para sala ou quarto.",
    price: 129.0,
    image: "assets/images/tapete-oval.jpg",
  },
  {
    id: "conjunto-baby",
    name: "Conjunto Baby Soft",
    description: "Sapatinho e touca em algodão macio, ideal para recém-nascidos.",
    price: 74.5,
    image: "assets/images/conjunto-baby.jpg",
  },
  {
    id: "porta-copos",
    name: "Kit Porta-copos (4un)",
    description: "Jogo de 4 porta-copos coloridos em crochê 100% algodão.",
    price: 39.9,
    image: "assets/images/porta-copos.jpg",
  },
  {
    id: "manta-trico",
    name: "Manta Ponto Trançado",
    description: "Manta grande, quentinha, feita com ponto trançado artesanal.",
    price: 219.9,
    image: "assets/images/manta-trico.jpg",
  },
];
