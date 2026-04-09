import { Datatables } from "../components/Datatables.js";

const table = Datatables.SetTable('#table-products', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'codigo_barra' },
    { data: 'unidade' },
    {
        data: 'preco_compra',
        render: function (data) {
            if (data == null) return '-';
            return parseFloat(data).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    },
    {
        data: 'preco_venda',
        render: function (data) {
            if (data == null) return '-';
            return parseFloat(data).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    },
    {
        data: 'ativo',
        render: function (data) {
            return data
                ? `<span class="badge bg-success">Ativo</span>`
                : `<span class="badge bg-danger">Inativo</span>`;
        }
    },
    {
        data: null,
        defaultContent: '',
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editProduct(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteProduct(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.products.find(filter)); // ✅

api.products.onReload(() => { // ✅
    table.ajax.reload(null, false);
});

async function deleteProduct(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
        const response = await api.products.delete(id); // ✅
        if (response.status) {
            toast('success', 'Excluído', response.msg);
            table.ajax.reload(null, false);
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editProduct(id) {
    try {
        const product = await api.products.findById(id); // ✅
        if (!product) {
            toast('error', 'Erro', 'Produto não encontrado.');
            return;
        }
        await api.temp.set('products:edit', { action: 'e', ...product });
        api.window.openModal('pages/products', {
            width: 800,
            height: 600,
            title: 'Editar Produto',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

window.deleteProduct = deleteProduct;
window.editProduct = editProduct;