import { faker } from '@faker-js/faker/locale/pt_BR';

export async function seed(knex) {
  await knex('users').del();

  const batchSize = 1000;
  const total = 10000; // Total de registros a serem inseridos

  for (let i = 0; i < total; i += batchSize) {
    
    const batch = Array.from({ length: batchSize }, () => ({
      nome: faker.person.fullName(),
      sobrenome: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      rg: faker.string.numeric(11),
      salario: faker.number.int({ min: 150, max: 200 }),
      senha: faker.string.numeric(12),
      ativo: faker.datatype.boolean(),
      administrador: faker.datatype.boolean(),
    }));

    await knex('users').insert(batch);
  }
  console.log('Seed de usuários concluída com sucesso!');
}