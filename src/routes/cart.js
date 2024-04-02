const router = require("express").Router();
const redis = require("redis").createClient();

router.get("/", async (req, res) => {
    const { idx } = req.body;
    const result = {
        "success": false,
        "message": "",
        "data": {
            "cart": null
        }
    }

    try {
        await redis.connect();
        const data = await redis.hGetAll(`cart${idx}`); //hGet
        result.data.cart = data;
        result.success = true;
    } catch (err) {
        result.message = err.message;
    } finally {
        redis.disconnect();
        res.send(result);
    }
})

router.post("/", async (req, res) => {
    const { idx, item } = req.body;
    const result = {
        "success": false,
        "message": ""
    }

    try {
        await redis.connect();

        const itemNumber = await redis.hGet(`cart${idx}`, item);
        if (itemNumber) {
            await redis.hSet(`cart${idx}`, item, parseInt(itemNumber) + 1);
        } else {
            await redis.hSet(`cart${idx}`, item, 1);
        }
        result.success = true;
    } catch (err) {
        result.message = err.message;
    } finally {
        redis.disconnect();
        res.send(result);
    }
})

router.delete("/", async (req, res) => {
    const { idx } = req.body;
    const result = {
        "success": false,
        "message": ""
    }

    try {
        await redis.connect();
        await redis.del(`cart${idx}`);
        result.success = true;
    } catch (err) {
        result.message = err.message;
    } finally {
        redis.disconnect();
        res.send(result);
    }
})

module.exports = router;