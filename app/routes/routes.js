module.exports = (app) => {

    
    const controlApi = require('../controllers/z.everything.controller.js');

    // Create a new Note
    app.post('/api/register', controlApi.register);
    app.post('/api/session/login', controlApi.loginUser);
    app.post('/api/session/logout', controlApi.logout);
    app.post('/api/getprofile', controlApi.getprofileuser);
    app.post('/api/updateprofile', controlApi.updateprofileuser);
    app.post('/api/carlist', controlApi.carlist);
    app.post('/api/carsave', controlApi.carsave);
    app.post('/api/cardelete', controlApi.cardelete);
    // Create a new Note
    app.post('/clearuser', controlApi.aaaaa);
    // Retrieve all Notes
    app.get('/api', controlApi.findAll);

    // // Retrieve all Notes
    // app.get('/aaaaaaaa', controlApi.findAll);

    // // Retrieve a single Note with noteId
    // app.get('/aaaaaaaa/:noteId', controlApi.findOne);

    // // Update a Note with noteId
    // app.put('/sssssss/:noteId', controlApi.update);

    // // Delete a Note with noteId
    // app.delete('/dddddd/:noteId', controlApi.delete);
}