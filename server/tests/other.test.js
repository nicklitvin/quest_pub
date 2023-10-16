import db from "../modules/dbManager";
import interpreter from "../modules/clientInterpter";
import { other_consts } from "../globalConstants.js";

describe("test other module", () => {

    beforeAll( async () => {
        db.make_database_connection();
        await db.make_empty_tables();
    })

    afterAll( async () => {
        db.close_database_connection();
    })

    afterEach( async () => {
        await db.clear_all_tables();
    })

    test("bad version", async () => {
        const bad_version = "bad";
        const email = "email";
        const token = "1";
        const userInfo = {"email": email};

        const good_version = other_consts.valid_versions[0];
        expect(interpreter.is_need_update(good_version)).toEqual(false);

        const x = await interpreter.login_with_token(token,userInfo,false,bad_version);
        expect(x.key).toEqual(null);
        expect(x.need_update).toEqual(true);

        const x1 = await interpreter.login_with_key(x.key,bad_version);
        expect(x1.key).toEqual(x.key);
        expect(x1.need_update).toEqual(true);

        const x2 = await interpreter.get_locations(x.key,0,0,bad_version);
        expect(x2.key).toEqual(x.key);
        expect(x2.need_update).toEqual(true);

        const x3 = await interpreter.get_events(x.key,0,0,bad_version);
        expect(x3.key).toEqual(x.key);
        expect(x3.need_update).toEqual(true);

        const x4 = await interpreter.claim_location(x.key,"place_id",0,0,bad_version);
        expect(x4.key).toEqual(x.key);
        expect(x4.need_update).toEqual(true);

        const x5 = await interpreter.claim_event(x.key,"event_id",0,0,bad_version);
        expect(x5.key).toEqual(x.key);
        expect(x5.need_update).toEqual(true);

        const x6 = await interpreter.get_user_activity(x.key,0,0,bad_version);
        expect(x6.key).toEqual(x.key);
        expect(x6.need_update).toEqual(true);

        const x7 = await interpreter.get_all(x.key,0,0,bad_version);
        expect(x7.key).toEqual(x.key);
        expect(x7.need_update).toEqual(true);

        const x8 = await interpreter.delete_account(x.key,bad_version);
        expect(x8.key).toEqual(x.key);
        expect(x8.need_update).toEqual(true);
    })
})