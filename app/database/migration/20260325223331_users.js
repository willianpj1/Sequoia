export function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('senha').notNullable();
        table.decimal('salario', 18, 4).defaultTo(0);
        table.text('sobrenome').notNullable();
        table.text('rg').notNullable();
        table.text('cpf').notNullable();
        table.boolean('ativo').defaultTo(true);
        table.boolean('administrador').defaultTo(false);
        //Data e hora do registro criado automaticamente
        table.timestamp('criado_em', { useTz: false }).defaultTo(knex.fn.now());
        table.timestamp('atualizado_em', { useTz: false }).defaultTo(knex.fn.now());
    });
}

export function down(knex) {
    return knex.schema.dropTable('users');
}