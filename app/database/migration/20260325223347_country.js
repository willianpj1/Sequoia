export function up(knex) {
    return knex.schema.createTable('country', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('sigla').notNullable();          // BR, US, PT...
        table.text('codigo_iso').notNullable();     // ISO 3166-1: BRA, USA...
        table.text('localizacao').notNullable();    // continente/região
        table.text('moeda').notNullable();          // Real, Dólar...
        table.text('codigo_moeda').notNullable();   // BRL, USD, EUR...
        table.text('idioma').notNullable();         // Português, Inglês...
        table.text('ddi').notNullable();            // +55, +1...
        table.boolean('ativo').defaultTo(true);
        table.timestamp('criado_em', { useTz: false }).defaultTo(knex.fn.now());
        table.timestamp('atualizado_em', { useTz: false }).defaultTo(knex.fn.now());
    });
}

export function down(knex) {
    return knex.schema.dropTable('country');
}