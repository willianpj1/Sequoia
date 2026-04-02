export function up(knex) {
    return knex.schema.createTable('enterprise', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome_fantasia').notNullable();
        table.text('sobrenome_razao').notNullable();
        table.text('cpf_cnpj').notNullable();
        table.text('rg_ie').notNullable();
        table.text('data_nascimento_abertura').notNullable();
        table.boolean('ativo').notNullable().defaultTo(false);
        //Data e hora do registro criado automaticamente
        table.timestamp('criado_em', { useTz: false }).defaultTo(knex.fn.now());
        table.timestamp('atualizado_em', { useTz: false }).defaultTo(knex.fn.now());
    });
}

export function down(knex) {
    return knex.schema.dropTable('company');
}