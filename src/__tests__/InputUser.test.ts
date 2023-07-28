import {jest, describe, expect, test } from "@jest/globals";
import { InputUser } from "../User/Domain/InputUser";

describe("Test class InputTask",  () => {
 
  test("initialize instance of class InputUser", async () => {
    const inputUser = await InputUser.runBeforeConstructor("string", "string");
    expect(inputUser).toBeInstanceOf(InputUser);
  });

  

  test('instance name property should be equal to first parameter', async () => {
    const spyStaticMethod = jest.spyOn(InputUser, 'runBeforeConstructor')
   const inputUser = await InputUser.runBeforeConstructor('user', "password")
   expect(spyStaticMethod).toHaveBeenCalledTimes(1)
    expect(inputUser.name).toBe("user")
    
  });


 
});
