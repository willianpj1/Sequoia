// Inicializa a tabela de fornecedores
const table = Datatables.SetTable('#table-suppliers', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'cnpj' },
    { data: 'email' },
    { data: 'telefone' },
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
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editSupplier(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteSupplier(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.suppliers.find(filter));

// Recarregamento automático
api.suppliers.onReload(() => {
    table.ajax.reload(null, false);
});

async function deleteSupplier(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.suppliers.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            table.ajax.reload(null, false);
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editSupplier(id) {
    try {
        const supplier = await api.suppliers.findById(id);
        if (!supplier) {
            toast('error', 'Erro', 'Fornecedor não encontrado.');
            return;
        }

        await api.temp.set('suppliers:edit', {
            action: 'e',
            ...supplier,
        });

        api.window.openModal('pages/suppliers', {
            width: 800,
            height: 600,
            title: 'Editar Fornecedor',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

// Exporta para o escopo global (importante para o onclick funcionar)
window.deleteSupplier = deleteSupplier;
window.editSupplier = editSupplier;