import connection from '../database/Connection.js';

export default class Enterprise {

    static table = 'enterprise';

    static #columns = ['id', 'nome_fantasia', 'sobrenome_razao', 'cpf_cnpj', 'rg_ie', 'data_nascimento_abertura', 'ativo'];

    static #searchable = ['nome_fantasia', 'sobrenome_razao', 'cpf_cnpj', 'rg_ie'];

    static async insert(data) {
        if (!data.nome_fantasia || data.nome_fantasia.trim() === '') {
            return { status: false, msg: 'O campo nome fantasia é obrigatório', id: null, data: [] };
        }

        try {
            const clean = Enterprise.#sanitize(data);

            const [result] = await connection(Enterprise.table)
                .insert(clean)
                .returning('*');

            return { status: true, msg: 'Salvo com sucesso!', id: result.id, data: [result] };

        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message, id: null, data: [] };
        }
    }

    static async find(data = {}) {
        const { term = '', limit = 10, offset = 0, orderType = 'asc', column = 0, draw = 1 } = data;

        const [{ count: total }] = await connection(Supplier.table)
            .where({ excluido: false })
            .count('id as count');

        const search = term?.trim();

        function applySearch(query) {
            query.where({ excluido: false });
            if (search) {
                query.where(function () {
                    for (const col of Enterprise.#searchable) {
                        this.orWhereRaw(`CAST("${col}" AS TEXT) ILIKE ?`, [`%${search}%`]);
                    }
                });
            }
            return query;
        }

        const filteredQ = connection(Enterprise.table).count('id as count');
        applySearch(filteredQ);
        const [{ count: filtered }] = await filteredQ;

        const orderColumn = Enterprise.#columns[column] || 'id';
        const orderDir = orderType === 'desc' ? 'desc' : 'asc';

        const dataQ = connection(Enterprise.table).select('*');
        applySearch(dataQ);
        dataQ.orderBy(orderColumn, orderDir);
        dataQ.limit(parseInt(limit));
        dataQ.offset(parseInt(offset));

        const rows = await dataQ;

        return {
            draw: parseInt(draw),
            recordsTotal: parseInt(total),
            recordsFiltered: parseInt(filtered),
            data: rows,
        };
    }

    static async findById(id) {
        if (!id) return null;

        const row = await connection(Enterprise.table)
            .where({ id, excluido: false })
            .first();

        return row || null;
    }

    static async update(id, data) {
        if (!id) return { status: false, msg: 'ID é obrigatório', data: [] };

        if (!data.nome || data.nome.trim() === '') {
            return { status: false, msg: 'O campo nome é obrigatório', data: [] };
        }

        try {
            const clean = Enterprise.#sanitize(data);
            delete clean.id;

            const [result] = await connection(Enterprise.table)
                .where({ id, excluido: false })
                .update(clean)
                .returning('*');

            if (!result) {
                return { status: false, msg: 'Enterprise não encontrado', data: [] };
            }

            return { status: true, msg: 'Atualizado com sucesso!', id: result.id, data: [result] };

        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message, data: [] };
        }
    }

    static async delete(id) {
        if (!id) return { status: false, msg: 'ID é obrigatório' };

        try {
            await connection(Enterprise.table).where({ id }).del();
            return { status: true, msg: 'Excluído com sucesso!' };
        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    static async count() {
        const [{ count }] = await connection(Enterprise.table)
            .whereNot({ excluido: true })
            .count('id as count');
        return parseInt(count);
    }

    static #sanitize(data) {
        const ignore = ['id', 'action'];
        const clean = {};

        for (const [key, value] of Object.entries(data)) {
            if (ignore.includes(key)) continue;
            if (value === '' || value === null || value === undefined) continue;
            if (value === 'true') { clean[key] = true; continue; }
            if (value === 'false') { clean[key] = false; continue; }
            clean[key] = value;
        }

        return clean;
    }
}