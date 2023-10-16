import db from "../modules/dbManager";
import interpreter from "../modules/clientInterpter";
import { db_names, other_consts } from "../globalConstants.js";

describe("test users module", () => {
    beforeAll( async () => {
        db.make_database_connection();
        await db.make_empty_tables();
    })

    afterAll( async () => {
        await db.clear_all_tables();
        db.close_database_connection();
    })

    afterEach( async () => {
        await db.run_sql(`delete from ${db_names.users_table}`);
    })

    test("token login + create user", async () => {
        const email = "email";
        const token = "1";
        const userInfo = {"email": email};

        const result = await interpreter.login_with_token(token,userInfo);
        expect(result.key == db.make_encrypted(token));

        const count = await db.run_sql(
            `
            select * from ${db_names.users_table} 
            where ${db_names.users_email_column} = '${db.make_encrypted(email)}';
            `
        );
        expect(count.length).toEqual(1);
    })

    test("token login + remember user", async () => {
        const email = "email";
        const userInfo = {"email": email};

        const initial = await interpreter.login_with_token("token",userInfo);
        const result = await interpreter.login_with_token("token1",userInfo);
        expect(result.key).toEqual(initial.key);

        const count = await db.run_sql(
            `
            select * from ${db_names.users_table} 
            where ${db_names.users_email_column} = '${db.make_email_encrypted(email)}';
            `
        );
        expect(result.key).toEqual(count[0][db_names.users_key_column]);
        expect(count.length).toEqual(1);
    })

    test("token login + bad token", async () => {
        const userInfo = {error: true};
        const result = await interpreter.login_with_token("token",userInfo);
        expect(result.key).toEqual(null);

        const count = await db.run_sql(`select * from ${db_names.users_table};`);
        expect(count.length).toEqual(0);
    })

    test("apple login + garbage", async () => {
        const result = await interpreter.login_with_token("bad",null,true);
        expect(result.key).toEqual(null);
    })

    test("key login + no such user", async() => {
        const result = await interpreter.login_with_key("bad key");
        expect(result.key).toEqual(null);
    })

    test("key login + remember user", async () => {
        const userInfo = {email: "2"};
        const login = await interpreter.login_with_token("token",userInfo);
        const result = (await interpreter.login_with_key(login.key))
        expect(result.key).toEqual(login.key);
    })

    test("delete + bad key", async () => {
        const get_length = async () => {
            const data = await db.run_sql(`select * from ${db_names.users_table}`);
            return data.length;
        }

        const userInfo = {email: "email"}
        await interpreter.login_with_token("token",userInfo);
        const res = await interpreter.delete_account("bad key");

        expect(res.key).toEqual(null);
        expect(res.valid).toEqual(false);
        expect(await get_length()).toEqual(1);
    })

    test("delete + good key", async () => {
        const get_length = async () => {
            const data = await db.run_sql(`select * from ${db_names.users_table}`);
            return data.length;
        }

        const userInfo1 = {email: "email1"}
        const userInfo2 = {email: "email2"};
        const user1 = await interpreter.login_with_token("token1",userInfo1);
        await interpreter.login_with_token("token2",userInfo2);
        expect(await get_length()).toEqual(2);

        const res = await interpreter.delete_account(user1.key);
        expect(res.key).toEqual(null);
        expect(res.valid).toEqual(true);
        expect(await get_length()).toEqual(1);
    })
})