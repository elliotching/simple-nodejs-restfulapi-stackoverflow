module.exports = (app) => {
    const notes = require('../controllers/note.controller.js');

  
    // Create a new Note
    app.post('/notes', notes.create);

    // Retrieve all Notes
    app.get('/notes', notes.findAll);

    // Retrieve a single Note with noteId
    app.get('/notes/:noteId', notes.findOne);

    // Update a Note with noteId
    app.put('/notes/:noteId', notes.update);

    // Delete a Note with noteId
    app.delete('/notes/:noteId', notes.delete);

    
    // const controlApi = require('../controllers/register.controller.js');

    // // Create a new Note
    // app.post('/aaaa', controlApi.create);

    // // Retrieve all Notes
    // app.get('/aaaaaaaa', controlApi.findAll);

    // // Retrieve a single Note with noteId
    // app.get('/aaaaaaaa/:noteId', controlApi.findOne);

    // // Update a Note with noteId
    // app.put('/sssssss/:noteId', controlApi.update);

    // // Delete a Note with noteId
    // app.delete('/dddddd/:noteId', controlApi.delete);
}