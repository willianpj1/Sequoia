export function up(knex) {
    return knex.schema.createTable('product', (table) => {
        table.bigIncrements('id').primary();
        table.text('codigo_barra').notNullable();
        table.text('nome').notNullable();
        table.text('descricao_curta').notNullable();
        table.decimal('valor', 18, 4);
        table.boolean('ativo').defaultTo(true);
        table.boolean('excluido').defaultTo(false);
        //Data e hora do registro criado automaticamente
        table.timestamp('criado_em', { useTz: false }).defaultTo(knex.fn.now());
        table.timestamp('atualizado_em', { useTz: false }).defaultTo(knex.fn.now());
    });
}

export function down(knex) {
    return knex.schema.dropTable('product');
}