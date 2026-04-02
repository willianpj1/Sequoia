// Inicializa a tabela e armazena na constante
const table = Datatables.SetTable('#table-customers', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'cpf' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editCustomer(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteCustomer(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.customer.find(filter));

// Recarrega usando a constante table
api.customer.onReload(() => {
    table.ajax.reload(null, false);
});

async function deleteCustomer(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.customer.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            table.ajax.reload(null, false);
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editCustomer(id) {
    try {
        const customer = await api.customer.findById(id);
        if (!customer) {
            toast('error', 'Erro', 'Cliente não encontrado.');
            return;
        }

        await api.temp.set('customer:edit', {
            action: 'e',
            ...customer,
        });

        api.window.openModal('pages/customer', {
            width: 600,
            height: 500,
            title: 'Editar Cliente',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

// Exporta para o escopo global
window.deleteCustomer = deleteCustomer;
window.editCustomer = editCustomer;