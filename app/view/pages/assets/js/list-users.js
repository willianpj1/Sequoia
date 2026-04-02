// Inicializa a tabela e armazena na constante (removido import)
const table = Datatables.SetTable('#table-users', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'cpf' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editUser(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteUser(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.users.find(filter));

// Utiliza a constante table para o reload
api.users.onReload(() => {
    table.ajax.reload(null, false);
});

async function deleteUser(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.users.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            table.ajax.reload(null, false);
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editUser(id) {
    try {
        const user = await api.users.findById(id);
        if (!user) {
            toast('error', 'Erro', 'Usuário não encontrado.');
            return;
        }

        await api.temp.set('users:edit', {
            action: 'e',
            ...user,
        });

        api.window.openModal('pages/user', {
            width: 600,
            height: 500,
            title: 'Editar Usuário',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

// Vincula ao escopo global
window.deleteUser = deleteUser;
window.editUser = editUser;