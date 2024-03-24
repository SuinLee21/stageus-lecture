const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
    const { token } = req.header;
    const result = {
        "success": false,
        "message": ""
    }

    try {
        //token 검증 ( 1. token이 조작되지 않았는지/ 2. 권한 체크(관리자같은 것) )

        //1. token이 조작되지 않았는지  2. token이 존재하는지
        jwt.verify(token, "STAGEUSBACKEND"); //try로 묶여있음.
        //메시지 종류 (1. jwt must be provided, 2. jwt expired, 3. invalid token)

        //필요하다면 3. 이 api를 사용할 권한이 있는지

        next();
    } catch (err) {
        if (err.message === "jwt must be provided") {
            result.message = "로그인이 필요합니다.";
        } else if (err.message === "jwt expired") {
            result.message = "세션이 만료되었습니다. 다시 로그인해주세요.";
        } else if (err.message === "invalid token") {
            result.message = "정상적이지 않은 접근입니다.";
        } else {
            result.message = err.message;
        }

        res.send(result);
    }
}

module.exports = checkLogin