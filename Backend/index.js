const express = require("express");
const fs = require("fs")
const cors = require("cors");
const multer = require("multer");
const { readJson, writeJson } = require("./fsUtils");
const { searchByUser, filterTag } = require("./searchFunctions");

const app = express();

app.use(cors());
app.use(express.static("public"))
app.use(express.json())

//Different File Pathes
const dataPath = "./posts.json"
const usersPath = "./users.json"

//request Logger
app.use((req, _, next) => {
    console.log("new REQUEST", req.url, req.method, req.body)
    next()
});
// typical get Posts request

app.get("/api/data", (_, res) => {
    readJson(dataPath).then(data => res.json({ success: true, result: data })).catch(err => res.json({ success: false, error: err }))
})
// typical get users request

app.get("/api/users", (_, res) => {
    readJson(usersPath).then(data => {
        res.json({ success: true, result: data })
    }).catch(err => res.json({ success: false, error: err }))
})


//   Query api for Search and Filter 

app.get("/api/posts/query", (req, res) => {
    const userID = req.query.userId
    const tag = req.query.tag
    readJson(dataPath).then(data => {
        const postResults = data.filter(post => searchByUser(post, userID)).filter(post => filterTag(post, tag))
        res.json({ success: true, result: postResults })
    }).catch(err => res.json({ success: false, error: err }))
})



// initiate Storage for Post Images
const storagePosts = multer.diskStorage({
    destination: "./public/postImg",
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});


const uploadPostImg = multer({ storage: storagePosts });

app.post("/api/posts/uploadimg", uploadPostImg.single("postImg"), (req, res, next) => {
    const newPost = {
        id: Date.now(),
        title: req.body.postTitle,
        content: req.body.postContent,
        img: req.file.path.replace("public/", "")
    }

    readJson(dataPath).then(data => writeJson(dataPath, [...data, newPost])).then(data => res.json({ success: true, result: data })).catch(err => res.json({ success: false, error: err }))

})



//Delete Post

app.delete("/api/data/:postId/delete", (req, res) => {
    const postId = req.params.postId;
    fs.unlink
    readJson(dataPath).then(data => {
        const newData = data.filter(post => post.id.toString() !== postId)
        const file = data.find(post => post.id.toString() === postId)
        const path = "./public/" + file.img
        fs.unlink(path, (err) => console.log(err))
        return newData
    }).then(data => writeJson(dataPath, data)).then(data => res.json({ success: true, result: data })).catch(err => res.json({ success: false, error: err }))

})

// 404 Not found handler
app.use((_, res) => {
    res.json({ success: false, error: "Page not found" })
});

// Starting Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("APP RUNNING at port " + PORT));
