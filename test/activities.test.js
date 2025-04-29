const pactum = require('pactum');
const faker = require('faker');


describe('Testes da API de Activities', () => {
  const baseUrl = 'https://fakerestapi.azurewebsites.net/api/v1/Activities';

  let validActivityData;
  let invalidActivityData;
  let activityId;

  beforeEach(() => {
    validActivityData = {
      id: 0, // Será ignorado no POST
      title: faker.lorem.words(3),
      dueDate: new Date().toISOString(),
      completed: faker.datatype.boolean()
    };

    invalidActivityData = {
      id: 0,
      title: '', // inválido (título vazio)
      dueDate: '', // inválido
      completed: faker.datatype.boolean()
    };
  });

  // 1 - Teste de criação de atividade com dados válidos
  it('POST /Activities - Criação bem-sucedida', async () => {
    const response = await pactum
      .spec()
      .post(baseUrl)
      .withJson(validActivityData)
      .expectStatus(200);

    activityId = response.json.id;
    expect(response.json.title).toEqual(validActivityData.title);
  });

  // 2 - Teste de criação de atividade com título inválido
  it('POST /Activities - Erro com título inválido', async () => {
    await pactum
      .spec()
      .post(baseUrl)
      .withJson({ ...validActivityData, title: '' })
      .expectStatus(400);
  });

  // 3 - Teste de listagem de atividades
  it('GET /Activities - Lista de atividades', async () => {
    await pactum
      .spec()
      .get(baseUrl)
      .expectStatus(200)
      .expectJsonLike([
        {
          id: activityId,
          title: validActivityData.title
        }
      ]);
  });

  // 4 - Teste de busca por ID de atividade existente
  it('GET /Activities/:id - Obter atividade existente', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/${activityId}`)
      .expectStatus(200)
      .expectJsonLike({
        id: activityId,
        title: validActivityData.title
      });
  });

  // 5 - Teste de busca por ID de atividade inexistente
  it('GET /Activities/:id - Erro para atividade inexistente', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/99999`) // ID inexistente
      .expectStatus(404);
  });

  // 6 - Teste de atualização de atividade com dados válidos
  it('PUT /Activities/:id - Atualização bem-sucedida', async () => {
    const updatedData = {
      ...validActivityData,
      title: faker.lorem.words(5),
      completed: true
    };

    const response = await pactum
      .spec()
      .put(`${baseUrl}/${activityId}`)
      .withJson(updatedData)
      .expectStatus(200);

    expect(response.json.id).toEqual(activityId);
    expect(response.json.title).toEqual(updatedData.title);
  });

  // 7 - Teste de erro ao atualizar atividade inexistente
  it('PUT /Activities/:id - Erro ao atualizar atividade inexistente', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}/99999`)
      .withJson(validActivityData)
      .expectStatus(404);
  });

  // 8 - Teste de erro de validação ao atualizar com dados inválidos
  it('PUT /Activities/:id - Erro de validação com dados inválidos', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}/${activityId}`)
      .withJson(invalidActivityData)
      .expectStatus(400);
  });

  // 9 - Teste de exclusão de atividade
  it('DELETE /Activities/:id - Exclusão bem-sucedida', async () => {
    await pactum
      .spec()
      .delete(`${baseUrl}/${activityId}`)
      .expectStatus(200);
  });

  // 10 - Teste de erro ao buscar atividade excluída
  it('GET /Activities/:id - Erro para atividade excluída', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/${activityId}`)
      .expectStatus(404);
  });

  // 11 - Teste de criação de atividade com dueDate vazio
  it('POST /Activities - Erro com dueDate vazio', async () => {
    await pactum
      .spec()
      .post(baseUrl)
      .withJson({ ...validActivityData, dueDate: '' })
      .expectStatus(400);
  });

  // 12 - Teste de criação de atividade com completed nulo
  it('POST /Activities - Erro com completed nulo', async () => {
    await pactum
      .spec()
      .post(baseUrl)
      .withJson({ ...validActivityData, completed: null })
      .expectStatus(400);
  });

  // 13 - Teste de atualização de atividade com título vazio
  it('PUT /Activities/:id - Erro com título vazio', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}/${activityId}`)
      .withJson({ ...validActivityData, title: '' })
      .expectStatus(400);
  });

  // 14 - Teste de atualização de atividade com dueDate vazio
  it('PUT /Activities/:id - Erro com dueDate vazio', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}/${activityId}`)
      .withJson({ ...validActivityData, dueDate: '' })
      .expectStatus(400);
  });

  // 15 - Teste de atualização de atividade com ID inválido (string)
  it('PUT /Activities/:id - Erro com ID inválido', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}/invalid-id`)
      .withJson(validActivityData)
      .expectStatus(400);
  });
});