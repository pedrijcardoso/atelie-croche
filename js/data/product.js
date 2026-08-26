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
    id: "porta-copo-2-cores",
    name: "Porta Copo 2 Cores",
    description: "Feito com fio ecológico, 85% algodão e 15% outras fibras. Tamanho da peça: 11,5cm aprox.",
    price: 6,
    image: "assets/portacopo2cores.jpg",
  },
  {
    id: "porta-isqueiro-ou-gloss",
    name: "Porta Isqueiro ou Gloss Cogumelo",
    description: "Feito com fio ecológico, 85% algodão e 15% outras fibras. Tamanho da peça: 25cm aprox.",
    price: 15,
    image: "assets/portaisqueiro.jpg",
  },
  {
    id: "chaveiro-borboleta",
    name: "Chaveiro Borboleta",
    description: "Feito com fio ecológico, 85% algodão e 15% outras fibras. Tamanho da peça:25cm aprox.",
    price: 15,
    image: "assets/chaveiroborboleta.jpg",
  },
  {
    id: "acessorio-floral",
    name: "Acessório Floral",
    description: "Feito com fio ecológico, 85% algodão e 15% outras fibras. Tamanho da peça: 100cm aprox.",
    price: 20,
    image: "assets/acessoriofloral.jpg",
  },
];
