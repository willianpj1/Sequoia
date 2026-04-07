import {SellingPriceCalculator} from "./components/SellingPriceCalculator.js";
const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action');
const Id = document.getElementById('id');
Inputmask("currency", {
    radixPoint: ',',
    inputtype: "text",
    prefix: 'R$ ',
    autoGroup: true,
    groupSeparator: '.',
    rightAlign: false,
    onBeforeMask: function (value) {
        return String(value).replace('.', ',');
    }
}).mask("#preco_venda, #preco_compra");

totaltax.addEventListener('input', () => {
    const calculator = new SellingPriceCalculator()
        .addPurchasePrice(preco_compra.value)
        .addTotalTax(total_imposto.value / 100)
        .addProfitMargin(margem_lucro.value / 100)
        .operatingCost(custo_operacional.value / 100);

    try {
        const result = calculator.getData();
        valor_venda_sugerido.value = result.valor_venda_sugerido.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        valor_total_imposto.value = result.valor_total_imposto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        valor_margem_lucro.value = result.valor_margem_lucro.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    }

//  CARREGA DADOS DE EDIÇÃO (se existirem)
(async () => {
    const editData = await api.temp.get('products:edit');
    if (editData) {
        // Modo edição
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';
        // Preenche todos os campos pelo atributo name
        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (!field) continue;

            if (field.type === 'checkbox') {
                field.checked = value === true || value === 'true';
            } else {
                field.value = value || '';
            }
        }
    } else {
        // Modo cadastro novo
        Action.value = 'c';
        Id.value = '';
    }
})();
InsertButton.addEventListener('click', async () => {
    let timer = 3000;
    $('#insert').prop('disabled', true);
    const data = formToJson(form);
    // Se NÃO é cadastro novo, pega o ID para update
    let id = Action.value !== 'c' ? Id.value : null;
    try {

        const response = Action.value === 'c'
            ? await api.products.insert(data)
            : await api.products.update(id, data);

        if (!response.status) {
            toast('error', 'Erro', response.msg, timer);
            return;
        }
        toast('success', 'Sucesso', response.msg, timer);
        form.reset();
        // Fecha a janela modal após 1.5s (tempo do toast)
        setTimeout(() => {
            api.window.close();
        }, timer);

    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message, timer);
    } finally {
        $('#insert').prop('disabled', false);
    }
});