const router = require("express").Router();
const { Client } = require("pg");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const checkLogin = require("../middlewares/checkLogin");

router.get("/", checkLogin, async (req, res) => {
    const { id } = req.body;
    const { token } = req.headers; //fetch에 header
    const result = {
        "success": false,
        "message": "",
        "data": null
    }

    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'ubuntu',
        password: '1234',
        database: 'web'
    })

    //예외처리
    try {


        // if (idx === null || idx === undefined || idx === "") {
        //     throw new Error("idx 값이 존재하지 않습니다.");
        // }

        //db 통신
        // await client.connect();
        // const sql = "SELECT * FROM backend.account WHERE id=$1";
        // const data = await client.query(sql, [id]);

        // const row = data.rows; //읽어 온 값

        // if (row.length === 0) {
        //     throw new Error("회원 정보가 존재하지 않아요.");
        // }

        result.success = true;
        // result.data = row;

        //db 결과 처리
    } catch (err) {
        console.log(err.message);
        result.message = err.message;
    } finally {
        if (client) {
            client.end(); //연결 가능한 connetion이 있어서 끊어줘야 함.
        }
        res.send(result);
    }
});

//post, put, delete;

router.post("/login", (req, res) => {
    const { id, pw } = req.body;
    const result = {
        "success": false,
        "message": "",
        "data": {
            "token": ""
        }
    }

    try {
        if (id !== "stageus" || pw !== "1234") {
            throw new Error("일치하는 회원 정보가 없습니다.");
        }

        //토큰 발행
        const token = jwt.sign({
            "idx": "10",
            "id": id,
            "name": "스테이지어스"
        }, "STAGEUSBACKEND", {
            "issuer": "stageus",
            "expiresIn": "5m"
        }) // payload, secret_key, header

        result.success = true;
        result.data.token = token;
    } catch (err) {
        result.message = err.message;
    } finally {
        res.send(result);
    }
})

//export 작업
module.exports = router;