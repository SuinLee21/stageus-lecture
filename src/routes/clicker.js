const router = require("express").Router();
const redis = require("redis").createClient();

router.get("/", async (req, res) => {
    const result = {
        "success": false,
        "message": "",
        "data": {
            "number": ""
        }
    }

    try {
        await redis.connect();
        let data = await redis.get("click_number"); //string type collection (click_number 라는 거 가져옴)
        result.data.number = data;
        result.success = true;
    } catch (err) {
        result.message = err.message;
    } finally {
        redis.disconnect();
        res.send(result);
    }
})

router.post("/", async (req, res) => {
    const result = {
        "success": false,
        "message": ""
    }

    try {
        await redis.connect();
        let data = await redis.get("click_number"); //string type collection (click_number 라는 거 가져옴)

        if (data) {
            await redis.set("click_number", parseInt(data) + 1);
        } else {
            await redis.set("click_number", 1);
        }

        result.success = true;
    } catch (err) {
        result.message = err.message;
    } finally {
        redis.disconnect();
        res.send(result);
    }
})

module.exports = router;