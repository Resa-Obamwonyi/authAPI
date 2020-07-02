const router = require('express').Router();
const verify = require('./verifyToken');


router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: 'My Post',
            description: 'This is my First Post in a secured and private route'
        } 
    });
});


module.exports = router;