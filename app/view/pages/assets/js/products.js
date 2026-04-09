const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action');
const Id = document.getElementById('id');
const form = document.getElementById('form');

// Campos monetários (R$)
const moneyFields = ['preco_compra', 'preco_venda', 'custo_operacional'];

// Campos percentuais (%)
const percentFields = ['margem_lucro', 'total_imposto'];

//Máscaras 
Inputmask({
    alias: 'numeric',
    digits: 2,
    digitsOptional: false,
    suffix: ' %',
    radixPoint: ',',
    groupSeparator: '.'
}).mask(document.querySelectorAll('#total_imposto, #margem_lucro'));

Inputmask('currency', {
    prefix: 'R$ ',
    groupSeparator: '.',
    radixPoint: ',',
    digits: 2
}).mask(document.querySelectorAll('#preco_compra, #custo_operacional, #preco_venda'));

//Formatadores
const formatCurrency = (value) => {
    let number = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : parseFloat(value);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
};

const formatPercent = (value) => {
    let number = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : parseFloat(value);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number) + ' %';
};

const parseNumber = (value) => {
    if (typeof value !== 'string') return parseFloat(value) || 0;
    return parseFloat(
        value
            .replace(/R\$\s?/g, '')
            .replace(/%/g, '')
            .replace(/\./g, '')
            .replace(',', '.')
            .trim()
    ) || 0;
};

//Cálculo do preço sugerido

const calcularPrecoSugerido = () => {
    const precoCompra = parseNumber(document.getElementById('preco_compra').value);
    const totalImposto = parseNumber(document.getElementById('total_imposto').value);
    const margemLucro = parseNumber(document.getElementById('margem_lucro').value);
    const custoOperacional = parseNumber(document.getElementById('custo_operacional').value);

    if (precoCompra <= 0) {
        document.getElementById('resultado-row').classList.add('d-none');
        return;
    }

    const impostoValor = precoCompra * (totalImposto / 100);
    const custoTotal = precoCompra + impostoValor + custoOperacional;
    const precoSugerido = custoTotal / (1 - margemLucro / 100);
    const margemValor = precoSugerido - custoTotal;

    document.getElementById('preco_venda').value = formatCurrency(precoSugerido);
    document.getElementById('val-imposto').textContent = formatCurrency(impostoValor);
    document.getElementById('val-custo').textContent = formatCurrency(custoOperacional);
    document.getElementById('val-margem').textContent = formatCurrency(margemValor);
    document.getElementById('val-venda').textContent = formatCurrency(precoSugerido);

    document.getElementById('resultado-row').classList.remove('d-none');
};

['preco_compra', 'total_imposto', 'margem_lucro', 'custo_operacional'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcularPrecoSugerido);
});

//Carrega dados para edição

(async () => {
    const editData = await api.temp.get('products:edit');
    if (editData) {
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';

        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (!field) continue;

            if (field.type === 'checkbox') {
                field.checked = value === true || value === 'true' || value === 1;
            } else if (moneyFields.includes(key)) {
                field.value = formatCurrency(value);
            } else if (percentFields.includes(key)) {
                field.value = formatPercent(value);
            } else {
                field.value = value ?? '';
            }
        }

        calcularPrecoSugerido();
        await api.temp.delete('product:edit');
    } else {
        Action.value = 'c';
        Id.value = '';
    }
})();

//Salvar 

InsertButton.addEventListener('click', async () => {
    const timer = 3000;
    $('#insert').prop('disabled', true);

    const data = formToJson(form);
    const id = Action.value !== 'c' ? Id.value : null;

    for (let key in data) {
        if (moneyFields.includes(key) || percentFields.includes(key)) {
            data[key] = parseNumber(data[key]);
        }
    }

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
        document.getElementById('resultado-row').classList.add('d-none');

        setTimeout(() => api.window.close(), timer);

    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message, timer);
    } finally {
        $('#insert').prop('disabled', false);
    }
});