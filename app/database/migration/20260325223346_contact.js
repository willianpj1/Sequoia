export function up(knex) {
    return knex.schema.createTable('contact', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('id_usuario').unsigned();
        table.text('tipo').notNullable();
        table.text('endereco_contato').notNullable();
        //Data e hora do registro criado e atualizado automaticamente
        table.timestamp('criado_em', { useTz: false }).defaultTo(knex.fn.now());
        table.timestamp('atualizado_em', { useTz: false }).defaultTo(knex.fn.now());
    

        table.foreign('id_usuario')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('NO ACTION');
    });
}

export function down(knex) {
    return knex.schema.dropTable('contact');
}