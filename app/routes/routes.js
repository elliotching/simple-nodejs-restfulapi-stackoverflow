module.exports = (app) => {
    const controlApi = require("../controllers/z.everything.controller.js");
    const l = require("./l.js");
    // Create a new Note
    app.post("/api/register", controlApi.register);
    app.post("/api/session/login", controlApi.loginUser);
    app.post("/api/session/logout", controlApi.logout);
    app.post("/api/getprofile", controlApi.getprofileuser);
    app.post(
        "/api/updateprofile",
        controlApi.updateprofileuser
    );
    app.post("/api/carlist", controlApi.carlist);
    app.post("/api/carsave", controlApi.carsave);
    app.post("/api/cardelete", controlApi.cardelete);
    // Create a new Note
    app.post("/clearuser", controlApi.aaaaa);
    // Retrieve all Notes
    app.get("/api", controlApi.findAll);
    app.get("/pdf", (req, res) => {
        res.append("content-type", "application/json");
        // console.log(l())
        // return res.send(require("Base64").atob(l()));

        const fs = require("fs");

        const data = fs.readFileSync("/Users/hi-chinglee.tang/prjs/simple-nodejs-restfulapi-stackoverflow/app/routes/lorem.pdf");
        // const data = require("../routes/lorem.pdf").toString();
        // console.log((data))
        return res.send(data);
    });

    // // Retrieve all Notes
    // app.get('/aaaaaaaa', controlApi.findAll);

    // // Retrieve a single Note with noteId
    // app.get('/aaaaaaaa/:noteId', controlApi.findOne);

    // // Update a Note with noteId
    // app.put('/sssssss/:noteId', controlApi.update);

    // // Delete a Note with noteId
    // app.delete('/dddddd/:noteId', controlApi.delete);
};
