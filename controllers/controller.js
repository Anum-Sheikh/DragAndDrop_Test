const DataService = require('../services/dataService');

module.exports.saveProcess = async (req, res) => {
    // console.log('----REQ-----', JSON.stringify(req));
    console.log('----REQ-----', req.body);
    let body = req.body;
    // console.log("Request Body :", req);
    const result = await DataService.saveProcess(body);
   
    res.send({
        "status": 200,
        "data": result
    });
};

module.exports.updateProcess = async (req, res) => {

    console.log('----REQ-----', req.body);
    let body = req.body;
    const result = await DataService.updateProcess(body);
   
    res.send({
        "status": 200,
        "data": result
    });
};






module.exports.getProcess = async (req, res) => {
    // console.log('----REQ-----', JSON.stringify(req));
    console.log('----REQ-----', req.query);
    //let id = req.body._id;
    let id = req.query.ProcessId;

    const result = await DataService.getProcess(id);
 
    res.send({
        "status": 200,
        "data": result
    });
};
module.exports.getAllProcess = async (req, res) => {
    const result = await DataService.getAllProcess();
    // return response
    res.send({
        "status": 200,
        "data": result
    });
    // return {
    //     "status": 200,
    //     "data": result
    //     //"errorMessage": message
    // }
};