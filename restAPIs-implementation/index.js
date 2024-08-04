const express = require('express');
const fs = require('fs'); // used to edit the json file
const path = require('path');
const users = require("./MOCK_DATA.json");
// let users = require(usersFilePath);     
const app = express();
const PORT = 8000;


//Middleware - Plugin - koi bhi xxx form data postman se aaya toh body mein daalne ka kaam karega
// it will create a javascript object and it will put to our body.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
app.get("/users", (req,res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

app.get("/api/users", (req,res) => {
    return res.json(users);
});

app.route('/api/users/:id').get((req,res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id)
    return res.json(user);
})
.put((req,res) => {
    // Edit user with id
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id ===id);
    if(index === -1)
        return res.status(404).json({ status: "User not found" });

    users[index] = {...users[index], ...req.body};
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users,null,2), (err) => {
        if (err) {
            return res.status(500).json({ status: "Error saving data" });
        }
        return res.json({status: "User Edited"});  
    // return res.json({status:"Pending"});
    })
})
.delete((req,res) => {
    // Delete user with id
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);
    if(index === -1)
        return res.status(404).json({ status: "User not found" });
    users.splice(index,1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users,null,2), (err) => {
        if (err) {
            return res.status(500).json({ status: "Error saving data" });
        }
        return res.json({status: "User Deleted"});
    });
})

app.post('/api/users', (req,res) => {
    // ToDo: Create new user
    // const body = req.body;
    // console.log("Body", body);

    users.push({id: users.length + 1,...req.body});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        return res.json({status: "success", id: users.length + 1});
    });
    //middleware is being used
    // return res.json({status: "pending"});
});


// app.get("/api/users/:id", (req,res) => {
//     const id = Number(req.params.id);
//     const user = users.find(user => user.id === id)
//     return res.json(user);
// });

// app.patch('/api/users/:id', (req,res) => {
//     // ToDo: Edit the user with id
//     return res.json({status: "pending"});
// });

// app.delete('/api/users/:id', (req,res) => {
//     // ToDo: Delete the user with id
//     return res.json({status: "pending"});
// });

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`))