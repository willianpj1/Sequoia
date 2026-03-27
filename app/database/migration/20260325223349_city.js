export function up(knex) {
    return knex.schema.createTable('city', (table) => {
        table.comment("tabela de cidades");
        table.bigIncrements('id').primary();
        table.bigInteger('id_federative_unit').unsigned();
        table.text('codigo').Nullable();      // 3550308, 3106200...
        table.text('nome').Nullable();             // São Paulo, Belo Horizonte...
        
        table.timestamp('criado_em', { useTz: false }).defaultTo(knex.fn.now());
        table.timestamp('atualizado_em', { useTz: false }).defaultTo(knex.fn.now());

        table.foreign('id_federative_unit')
            .references('id')
            .inTable('federative_unit')
            .onDelete('CASCADE')
            .onUpdate('NO ACTION');
    });
}

export function down(knex) {
    return knex.schema.dropTable('city');
}