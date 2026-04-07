export class SellingPriceCalculator {
    #purchasePrice = 0;
    #totalTax = 0;
    #profitMargin = 0;
    #operatingCost = 0;

    static create() {
        return new SellingPriceCalculator();
    }

    addPurchasePrice(purchasePrice) {
        this.#purchasePrice = purchasePrice; // ✅ usando # corretamente
        return this;
    }

    addTotalTax(totalTax) {
        this.#totalTax = totalTax;
        return this;
    }

    addProfitMargin(profitMargin) {
        this.#profitMargin = profitMargin;
        return this;
    }

    operatingCost(operatingCost) {
        this.#operatingCost = operatingCost;
        return this;
    }

    getData() {
        if (!this.#purchasePrice) {
            throw new Error("Preço de compra é obrigatório.");
        }

        const totalPercentage = this.#totalTax + this.#profitMargin + this.#operatingCost;

        if (totalPercentage >= 1) {
            throw new Error("A soma de imposto, margem de lucro e custo operacional deve ser menor que 100%.");
        }

        const sellingPrice = this.#purchasePrice / (1 - totalPercentage);

        return {
            valor_venda_sugerido: parseFloat(sellingPrice.toFixed(4)),
            valor_total_imposto: parseFloat((sellingPrice * this.#totalTax).toFixed(4)),
            valor_margem_lucro: parseFloat((sellingPrice * this.#profitMargin).toFixed(4)),
        };
    }

    // ✅ Encapsula toda a lógica de DOM dentro da classe
    static bindForm() {
        const inputFields = ['preco_compra', 'total_imposto', 'margem_lucro', 'custo_operacional'];
        inputFields.forEach(id => {
            document.getElementById(id)?.addEventListener('input', SellingPriceCalculator.#calculateFromForm);
        });
    }

    static #calculateFromForm() {
        const rawValue = document.getElementById('preco_compra')?.value;
        console.log('Valor bruto preco_compra:', rawValue);

        const get = id => {
            const raw = document.getElementById(id)?.value ?? '';
            // Remove R$, pontos de milhar e troca vírgula por ponto
            const cleaned = raw.replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
            const parsed = parseFloat(cleaned);
            console.log(`${id}:`, raw, '->', parsed);
            return isNaN(parsed) ? 0 : parsed;
        };


        try {
            const result = SellingPriceCalculator.create()
                .addPurchasePrice(get('preco_compra'))
                .addTotalTax(get('total_imposto') / 100)
                .addProfitMargin(get('margem_lucro') / 100)
                .operatingCost(get('custo_operacional') / 100)
                .getData();

            set('valor_venda_sugerido', result.valor_venda_sugerido);
            set('valor_total_imposto', result.valor_total_imposto);
            set('valor_margem_lucro', result.valor_margem_lucro);
        } catch {
            ['valor_venda_sugerido', 'valor_total_imposto', 'valor_margem_lucro']
                .forEach(id => set(id, ''));
        }
    }
}