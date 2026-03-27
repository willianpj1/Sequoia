const URL_DISTRITOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/distritos';

exports.seed = async function (knex) {
  await knex('city').del();
  const UFs = await knex('federative_unit').select('id', 'codigo');

  // 1. BUSCA TODOS OS DISTRITOS
  const response = await fetch(URL_DISTRITOS);
  if (UFs.length <= 0) {
    throw new Error("Restrição");
  }
  for (const uf of UFs) {
    const URL = URL_DISTRITOS + uf.codigo + '/municipios';
    const response = await fetch(URL);
    const cidades = await response.json();
    const data = cidades.map((cidade) => ({
      id_uf: uf.id,
      codigo: cidade?.id,
      nome: cidade?.nome
    }));
    await knex('city').insert(data);
  }
};