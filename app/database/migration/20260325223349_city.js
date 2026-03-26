export function up(knex) {
    return knex.schema.createTable('city', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();             // São Paulo, Belo Horizonte...
        table.text('codigo_ibge').notNullable();      // 3550308, 3106200...
        table.text('cep_inicio').notNullable();       // faixa inicial de CEP
        table.text('cep_fim').notNullable();          // faixa final de CEP
        table.bigInteger('id_federative_unit').unsigned();
        table.boolean('capital').defaultTo(false);    // é capital do estado?
        table.boolean('ativo').defaultTo(true);
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