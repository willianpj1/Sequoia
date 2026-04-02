export function up(knex) {
    return knex.schema.createTable('customer', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('cpf');
        table.text('rg');
        table.boolean('ativo').defaultTo(true);
        table.boolean('excluido').defaultTo(false);
        //Data e hora do registro criado automaticamente
        table.timestamp('criado_em', { useTz: false }).defaultTo(knex.fn.now());
        table.timestamp('atualizado_em', { useTz: false }).defaultTo(knex.fn.now());
    });
}

export function down(knex) {
    return knex.schema.dropTable('customer');
}