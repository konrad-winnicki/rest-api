import supertest from "supertest";
import { describe, expect, test, afterAll, beforeEach } from "@jest/globals";
import { databaseConnector } from "../Common/Infrastructure/dependencias";
import { app } from "../app";
import request from "supertest"

const isGeneratingDocs: boolean = process.env.NODE_ENV === 'dev-docs' 
const api = isGeneratingDocs ? request("http://localhost:4001") : supertest(app);

async function createUser(name:string, password:string) {
  const response = await api
    .post("/api/v1/users/")
    .send({ name: name, password: password });
  return response.body.Created;
}

async function loginUser(name:string, password:string) {
  const response = await api
    .post(`/api/v1/users/login`)
    .send({ name: name, password: password });
  return response.body.accessToken;
}

async function createTask(token: string, name:string, date:string, time:string) {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const task = await api
    .post(`/api/v1/tasks/`)
    .set(headers)
    .send({ name: name, date: date, time: time })
    ;

  return task.body.Created.id;
}

async function getTasks(token: string) {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  return await api.get(`/api/v1/tasks/`).set(headers).send();
}

async function changeStatus(token: string, taskId: string) {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  await api.put(`/api/v1/tasks/${taskId}`).set(headers).send();
}
describe("REST API TEST", () => {
  beforeEach(async () => {
    await databaseConnector.getUserModel().deleteMany({});
  });

  test("Should  fail if route does not exist:", async () => {
    await api.post("/api/v1/users/logi").expect(404);
  });

  test("Should create user:", async () => {
    await api
      .post("/api/v1/users/")
      .send({ name: "first user", password: "first password" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("Should fail to create user if duplicated name:", async () => {
    await createUser("user1", "password");
    await api
      .post("/api/v1/users/")
      .send({ name: "user1", password: "password" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should fail if reques body lacks name:", async () => {
    await api
      .post("/api/v1/users/")
      .send({ password: "password" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });


  test("Should fail if reques body lacks password:", async () => {
    
    await api
      .post("/api/v1/users/")
      .send({ name: "user" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("Should login user:", async () => {
    await createUser("user1", "password");
    const accesToken = await api
      .post(`/api/v1/users/login`)
      .send({ name: "user1", password: "password" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(accesToken.body.accessToken).toContain('')
    
  });

  test("Login shoud fail if wrong user name", async () => {
    await createUser("user1", "password");
    await api
      .post(`/api/v1/users/login`)
      .send({ name: "wrongName", password: "password" })
      .expect(401)
      .expect("Content-Type", /application\/json/);
    
   
  });

  test("Login shoud fail if wrong user password", async () => {
    await createUser("user1", "password");

 
    await api
      .post(`/api/v1/users/login`)
      .send({ name: "user1", password: "wrongPassword" })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  test("Should create task", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");

    const headers = {
      Authorization: `bearer ${token}`,
    };

    const response = await api
      .post(`/api/v1/tasks/`)
      .set(headers)
      .send({ name: "task1", date: "", time: "" })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const tasks = await getTasks(token);
    expect(response.body.Created.id).toEqual(tasks.body.Tasks[0].id);
    expect(tasks.body.Tasks[0].name).toBe('task1')
    expect(tasks.body.Tasks[0].deadline).toBeNull
    expect(tasks.body.Tasks[0].status).toBe('pending')
  });

  test("Fail to create task if no name:", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");

    const headers = {
      Authorization: `bearer ${token}`,
    };

    await api
      .post(`/api/v1/tasks/`)
      .set(headers)
      .send({ date: "", time: "" })
      .expect(400)
      .expect("Content-Type", /application\/json/);

  });

  test("Fail to create task if no date:", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");

    const headers = {
      Authorization: `bearer ${token}`,
    };

    await api
      .post(`/api/v1/tasks/`)
      .set(headers)
      .send({ name: "task1", time: "" })
      .expect(400)
      .expect("Content-Type", /application\/json/);

   
  });

  test("Fail to create task if no time:", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");

    const headers = {
      Authorization: `bearer ${token}`,
    };

    await api
      .post(`/api/v1/tasks/`)
      .set(headers)
      .send({ name: "task1", date: ""})
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("Should fail if data format is wrong", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");

    const headers = {
      Authorization: `bearer ${token}`,
    };

    await api
      .post(`/api/v1/tasks/`)
      .set(headers)
      .send({ name: "task1", date: "01-01-1990", time: "15:00" })
      .expect(400)
      .expect("Content-Type", /application\/json/);

  
  });

  test("Should fail if time format is wrong", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");

    const headers = {
      Authorization: `bearer ${token}`,
    };

    await api
      .post(`/api/v1/tasks/`)
      .set(headers)
      .send({ name: "task1", date: "1990-01-01", time: "00,00" })
      .expect(400)
      .expect("Content-Type", /application\/json/);

  });

  test("Should list tasks:", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");
    const taskId = await createTask(token, 'task1', '1990-01-01', "");

    const headers = {
      Authorization: `bearer ${token}`,
    };

    const getResponse = await api
      .get(`/api/v1/tasks/`)
      .set(headers)
      .send()
      .expect(200);

    expect(getResponse.body.Tasks).toHaveLength(1);
    expect(taskId).toEqual(getResponse.body.Tasks[0].id);
    expect(getResponse.body.Tasks[0].name).toEqual('task1')
    expect(getResponse.body.Tasks[0].deadline).toEqual(new Date('1990-01-01').toISOString());
  });

  test("Should update task", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");
    const taskId = await createTask(token, 'task1', '', '');
    const headers = {
      Authorization: `bearer ${token}`,
    };
    await api.put(`/api/v1/tasks/${taskId}`).set(headers).send().expect(200);
    const tasks = await getTasks(token)
    expect(tasks.body.Tasks[0].status).toBe('accomplished')
  });

  test("Should fail if task is already accomplished", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");
    const taskId = await createTask(token, 'task1', '', '');
    await changeStatus(token, taskId);
    const headers = {
      Authorization: `bearer ${token}`,
    };
    await api.put(`/api/v1/tasks/${taskId}`).set(headers).send().expect(409);

  });

  test("Should delete task", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");
    const taskId = await createTask(token, 'task1', '', '');

    const headers = {
      Authorization: `bearer ${token}`,
    };
    await api.delete(`/api/v1/tasks/${taskId}`).set(headers).send().expect(200);
    const tasks = await getTasks(token)
    expect(tasks.body.Tasks).toHaveLength(0)
  });

  test("Delete task should fail if task do not exist:", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");
    const nonExistingTaskId = "64c052cab85437ceb3d18fc8";
    const headers = {
      Authorization: `bearer ${token}`,
    };
    await api
      .delete(`/api/v1/tasks/${nonExistingTaskId}`)
      .set(headers)
      .send()
      .expect(404);
  });

  test("Task update should fail if task do not exist", async () => {
    await createUser("user1", "password");
    const token = await loginUser("user1", "password");
    const nonExistingTaskId = "64c052cab85437ceb3d18fc8";
    const headers = {
      Authorization: `bearer ${token}`,
    };
    await api
      .put(`/api/v1/tasks/${nonExistingTaskId}`)
      .set(headers)
      .send()
      .expect(404);
  });
  test("Should delete user", async () => {
    const userId = await createUser("user1", "password");
    const token = await loginUser("user1", "password");
    const headers = {
      Authorization: `bearer ${token}`,
    };

    await api.delete(`/api/v1/users/${userId}`).set(headers).send().expect(200);
  });

  test("User cannot delete account of other user", async () => {
    await createUser("user1", "password");
    const userId2 = await createUser("user2", "password2");
    const tokenUser1 = await loginUser("user1", "password");
    const headers = {
      Authorization: `bearer ${tokenUser1}`,
    };

    await api.delete(`/api/v1/users/${userId2}`).set(headers).send().expect(403);
    await api
      .post(`/api/v1/users/login`)
      .send({name:"user2", password:"password2"})
      .expect(200)
  });

  test("User cannot post task to other user", async () => {
    await createUser("user1", "password");
    await createUser("user2", "password2");
    const tokenUser1 = await loginUser("user1", "password");
    const headers = {
      Authorization: `bearer ${tokenUser1}`,
    };

    await api.post(`/api/v1/tasks`).set(headers).send().expect(400);
    const tokenUser2 = await loginUser("user2", "password2");
    const tasks = await getTasks(tokenUser2)
    expect(tasks.body.Tasks).toHaveLength(0)
    
  });

  test("Task creation should fail if token expired", async () => {
    const expiredToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YmVjMzFiNzliZmM4MGZlNTMyOWNkZiIsIm5hbWUiOiJ1c2VyMSIsImlhdCI6MTY5MDIyMzY2MCwiZXhwIjoxNjkwMjI3MjYwfQ.IDFZlq-FuzqApm2B_j3vqujJ0fiE5O7NBhQ_wrHXOgQ";

    const headers = {
      Authorization: `bearer ${expiredToken}`,
    };

    await api
      .post(`/api/v1/tasks/`)
      .set(headers)
      .send({ name: "task1", date: "", time: "" })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  afterAll(() => { databaseConnector.connection.close(); });
});
