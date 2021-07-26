const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.post('/saveProcess', controller.saveProcess);
router.post('/updateProcess', controller.updateProcess);
router.get('/getAllProcess', controller.getAllProcess);
router.get('/getProcess', controller.getProcess);

module.exports = router;


