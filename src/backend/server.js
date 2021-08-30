const http = require('http');
const server = http.createServer();
const fs = require('fs');
const url = require('url');
const express = require('express')
const app = express()
//import { URL } from 'url';
//import * as fs from 'fs';
const upload = require('express-fileupload')
const bodyParser = require('body-parser')

app.use(upload())
app.use(bodyParser())


const _jsonType = { "Content-Type": "application/json; charset=utf-8" };
const _entriesFile = '../assets/blog-entries.json';
const _usersFile = '../assets/users.json';
const _entries = JSON.parse(fs.readFileSync(_entriesFile, { encoding: 'utf8' }));
const _users = JSON.parse(fs.readFileSync(_usersFile, { encoding: 'utf8' }));

const updateJson = (tag) => {
    switch (tag) {
        case 'user':
            fs.writeFile(_usersFile, JSON.stringify(_users), 'utf8', (err) => {
                if (err) console.log('JSON ERR', err)
            })
            break
        case 'blog':
            fs.writeFile(_entriesFile, JSON.stringify(_entries), 'utf8', (err) => {
                if (err) console.log('JSON ERR', err)
            })
            break
        default:
            console.log("錯誤的TAG")
            break
    }
}

const getUserMaxId = () => {
    let userid = 0
    let eleid
    _users.forEach(ele => {
        eleid = Number.parseInt(ele.id)
        if (eleid > userid) userid = eleid
    })
    userid = String(userid + 1)
    return userid
}

const getBlogMaxId = () => {
    let blogid = 0
    let eleid
    _entries.forEach(blog => {
        eleid = Number.parseInt(blog.id)
        if (eleid > blogid) blogid = eleid
    })
    blogid = String(blogid + 1)
    return blogid
}

const getUserById = (userid) => {
    let user = null
    _users.forEach(ele => {
        if (ele.id == userid) {
            user = ele
        }
    })
    return user
}

const getBlogById = (blogid) => {
    let blog = null
    _entries.forEach(ele => {
        if (ele.id == blogid)
            blog = ele
    })
    return blog
}

const checkRepeatEmail = (email) => {
    let is_repeat = false
    _users.forEach(ele => {
        if (ele.email == email)
            is_repeat = true
    })

    return is_repeat
}

app.get('/api/blog-entries', (req, res) => {

    let qsObj = url.parse(req.url, true).query;
    let previousPage = Number.parseInt(qsObj.page)-1
    let itemsPerPage = Number.parseInt(qsObj.limit)
    let replyObj = { }
    let items = _entries

    let startIndex = previousPage * itemsPerPage >= items.length ?
        0 : previousPage * itemsPerPage
    let endIndex = startIndex + itemsPerPage > items.length ?
        items.length : startIndex + itemsPerPage
    let targetItem = items.slice(startIndex, endIndex)
    if (targetItem.length > 1) {
        targetItem.sort((a, b) => {
            return (Number.parseInt(a.id) - Number.parseInt(b.id))
        })
    }

    replyObj.items = targetItem
    replyObj.meta = {
        totalItems: items.length,
        itemCount: 1,
        itemsPerPage: itemsPerPage,
        totalPages: items.length / itemsPerPage <= 0 ? 1 : items.length / itemsPerPage,
        currentPage: previousPage+1
    }
    replyObj.links = {
        first: `?limit=${itemsPerPage}`,
        previous: '',
        next: `?limit=${itemsPerPage}&page=${previousPage + 1}`,
        last: `?limit=${itemsPerPage}&page=${items.length / itemsPerPage}`
    }
    res.status(200).json(replyObj)
    //res.write()
    res.end()
})

app.get('/api/blog-entries/:id', (req, res) => {
    let blogid = req.params.id
    let blog = getBlogById(blogid)
    res.json(blog)
    res.end()
})

app.post('/api/blog-entries/upload', (req, res) => {
    if (req.files) {
        if (req.files.file) {
            let file = req.files.file
            let filename = file.name
            //let size = file.size
            //let mimetype = file.mimetype
            let dir = '../assets/uploads/blog/'

            file.mv(dir + filename, (err) => {
                if (err) console.log(err)
            })
        }

        if (req.files.userid && req.files.blog) {
            let blog = JSON.parse(req.files.blog.data.toString())
            let userid = JSON.parse(req.files.userid.data.toString()).userid

            if (_entries.length == 0) {
                let blogid = '1'
                blog.id = blogid
            }
            else {
                let blogid = getBlogMaxId()
                blog.id = blogid
            }
            blog.createdAt = new Date()
            blog.likes = 0
            blog.author = getUserById(userid)

            _entries.push(blog)
            updateJson('blog')
            console.log('新增BLOG')

        }
        else {
            console.log('NO ID')
        }
        res.end()
    }
    else {
        console.log("NO")
        res.end()
    }
})

app.get('/api/blog-entries/user/:id', (req, res) =>{
    let userid = req.params.id
    console.log('userid',userid)
    let qsobj = url.parse(req.url, true).query;
    let previousPage = Number.parseInt(qsobj.page)-1
    let itemsPerPage = Number.parseInt(qsobj.limit)
    let replyObj = { }
    //let items = _entries
    let items = []

    _entries.forEach((ele) => {
        console.log('ele.author.id',ele.author.id)
        if (ele.author.id == userid)
            items.push(ele)
    })
    console.log('items',items)
    let startIndex = previousPage * itemsPerPage >= items.length ?
        0 : previousPage * itemsPerPage
    let endIndex = startIndex + itemsPerPage > items.length ?
        items.length : startIndex + itemsPerPage
    let targetItem = items.slice(startIndex, endIndex)
    if (targetItem.length > 1) {
        targetItem.sort((a, b) => {
            return (Number.parseInt(a.id) - Number.parseInt(b.id))
        })
    }

    replyObj.items = targetItem
    replyObj.meta = {
        totalItems: items.length,
        itemCount: 1,
        itemsPerPage: itemsPerPage,
        totalPages: items.length / itemsPerPage <= 0 ? 1 : items.length / itemsPerPage,
        currentPage: previousPage+1
    }
    replyObj.links = {
        first: `?limit=${itemsPerPage}`,
        previous: '',
        next: `?limit=${itemsPerPage}&page=${previousPage + 1}`,
        last: `?limit=${itemsPerPage}&page=${items.length / itemsPerPage}`
    }
    res.json(replyObj)
    res.end()
})

app.get('/api/users', (req, res) => {
    let qsObj = url.parse(req.url, true).query;
    console.log('qsObj',qsObj.page)
    let previousPage = Number.parseInt(qsObj.page)-1
    if(previousPage < 0)
        previousPage = 0
    let itemsPerPage = Number.parseInt(qsObj.limit)
    let replyObj = { }
    let items = []
    if (qsObj.username && qsObj.username != '') {   
        for (var i = 0; i < _users.length; i++) {
            if (_users[i].name.includes(qsObj.username)) {
                items.push(_users[i])
            }
        }
    }
    else {
        items = _users
    }

    console.log('items',items)
    let startIndex = previousPage * itemsPerPage >= items.length ?
        0 : previousPage * itemsPerPage
    let endIndex = startIndex + itemsPerPage > items.length ?
        items.length : startIndex + itemsPerPage
    let targetItem = items.slice(startIndex, endIndex)
    console.log("startIndex, endIndex",startIndex, endIndex)
    if (targetItem.length > 1) {
        targetItem.sort((a, b) => {
            return (Number.parseInt(a.id) - Number.parseInt(b.id))
        })
    }
    console.log('targetItem',targetItem)
    replyObj.items = targetItem
    replyObj.meta = {
        totalItems: items.length,
        itemCount: 1,
        itemsPerPage: itemsPerPage,
        totalPages: items.length / itemsPerPage <= 0 ? 1 : items.length / itemsPerPage,
        currentPage: previousPage+1
    }
    replyObj.links = {
        first: `?limit=${itemsPerPage}`,
        previous: '',
        next: `?limit=${itemsPerPage}&page=${previousPage + 1}`,
        last: `?limit=${itemsPerPage}&page=${items.length / itemsPerPage}`
    }

    res.json(replyObj)
    res.end()
})

app.post('/api/users/regist', (req, res) => {

    let user = req.body
    delete user.confirmPassword
    console.log('req.body', user)
    if (checkRepeatEmail(user.email)) {
        res.json({ valid: false, msg: '此帳號已被註冊' })
        res.end()
        return
    }
    user.id = getUserMaxId()
    user.role = 'User'
    _users.push(user)
    updateJson('user')
    res.json({ valid: true, msg: '註冊成功' })
    res.end()
})


app.get('/api/user/login', (req, res) => {
    let qsObj = url.parse(req.url, true).query;
    let email = qsObj.email
    let password = qsObj.password

    let user = null
    _users.forEach(ele => {
        if (ele.email == email)
            user = ele
    })
    if (user != null) {
        if (user.password == password) {
            res.json({ valid: true, msg: '登入成功', token: user.id })
            res.end()
        }
        else {
            res.json({ valid: false, msg: '密碼錯誤' })
            res.end()
        }
    }
    else {
        res.json({ valid: false, msg: '無此帳號' })
        res.end()
    }
})

app.get('/api/users/:id', (req, res) => {

    let id = Number.parseInt(req.params.id)
    if (id == 0) {
        res.end()
        return
    }
    let user = null
    for (let i = 0; i < _users.length; i++) {
        if (_users[i].id == id)
            user = _users[i]
    }
    if (user != null) {
        res.writeHead(200, _jsonType)
        res.write(JSON.stringify(user))
        res.end()
    }
    else {
        console.log('無此ID帳號')
        res.end()
    }
})

app.put('/api/users', (req, res) => {
    let updateInfo = req.body
   
    _users.forEach((user) => {
        if (user.id == updateInfo.id) {
            let keys = Object.keys(updateInfo)
            keys.forEach((key) => {
                user[key] = updateInfo[key]
            })
        }
    })
    updateJson('user')    
    res.end()
    console.log('更新一筆USER資料')
})

app.post('/api/users/upload', (req, res) => {
    if (req.files) {
        let file = req.files.file
        let filename = file.name
        let size = file.size
        let mimetype = file.mimetype
        let dir = '../assets/uploads/usericon/'
        file.mv(dir + filename, (err) => {
            if (err) console.log(err)
            res.json({ profileImage: filename })
            res.end()
        })
    }
    else {
        console.log("NO")
    }
})

app.post('/api/users/image', (req, res) => {
    if (req.body) {
        let id = req.body.id
        let imgname = req.body.imgname
        _users.forEach((user) => {
            if (user.id == id) {
                user.profileImage = imgname
                fs.writeFile(_usersFile, JSON.stringify(_users), 'utf8', (err) => {
                    if (err) console.log('JSON ERR', err)
                })
            }
        })
        res.status(200).end()
    }
    else res.status(401).end()
})


app.get('/favicon.ico', (req, res) => res.end())


/*
server.on('request', (req, res) => {
    const urlObj = url.parse(req.url)
    if (urlObj.pathname == '/api/blog-entries') {
        console.log(urlObj.pathname)
        res.writeHead(200, _jsonType)
        //res.write(JSON.stringify(_entries));
        res.write(_entries)
        res.end()
    }
    else if (urlObj.pathname == '/api/users') {
        if (req.method == 'GET') {
            let qsObj = url.parse( req.url, true ).query;
            let targetPage = Number.parseInt(qsObj.page)
            let itemsPerPage = Number.parseInt(qsObj.limit)
            let replyObj = {}
            let items = []
            if(qsObj.username) {
                for(var i=0; i< _users.length; i++) {                         
                    if(_users[i].name.includes(qsObj.username))
                        items.push(_users[i])
                }                   
            }
            else {    
                items = _users  
            }            
            
            let startIndex = targetPage*itemsPerPage >= items.length ? 
                        0 : targetPage*itemsPerPage
            let endIndex = startIndex + itemsPerPage > items.length ? 
                        items.length : startIndex + itemsPerPage
            let targetItem = items.slice(startIndex, endIndex)   
            if(targetItem.length > 1) {
                targetItem.sort((a,b) => {
                    return (a.id - b.id)
                })
            }         
            
            replyObj.items = targetItem
            replyObj.meta = {
                totalItems: items.length,
                itemCount: 1,
                itemsPerPage: itemsPerPage,
                totalPages: items.length / itemsPerPage <= 0 ? 1:items.length / itemsPerPage,
                currentPage: targetPage
            }
            replyObj.links = {
                first: '123',
                previous: '456',
                next: '789',
                last: '108'
            }

            res.writeHead(200, _jsonType)
            res.end(JSON.stringify(replyObj))
        }
        else if (req.method == 'POST') {
            res.writeHead(200, _jsonType)
            let chunks = []
            req.on("data", chunk => chunks.push(chunk))
            req.on("end", () => {
                let registerInfo = JSON.parse(Buffer.concat(chunks).toString())
                let keys = Object.keys(registerInfo)
                let registerObj = {}
                for (let i =0; i< keys.length; i++){
                    if(keys[i] == 'confirmPassword') continue
                    registerObj[keys[i]] = registerInfo[keys[i]]
                }

                let checkEmail = null
                for(let i=0; i< _users.length; i++) {
                    if(_users[i].email == registerObj.email) {
                        checkEmail = _users[i].email
                    }
                }
                if(!checkEmail) {
                    let index = 0
                    for(let i=0; i<_users.length; i++) {
                        if(_users[i].id > index) {
                            index = _users[i].id
                        }
                    }
                    registerObj.id = (index+1)
                    _users.push(registerObj)
                    fs.writeFile(_usersFile, JSON.stringify(_users), 'utf8', (err) => {
                        if (err) console.log('JSON ERR', err)                            
                    })

                    let reply = { valid: true, msg: '註冊成功' }
                    res.write(JSON.stringify(reply))
                    res.end()                    
                }
                else { 
                    let reply = { valid: false, msg: '此帳號已被註冊' }
                    res.write(JSON.stringify(reply))
                    res.end()  
                }                
            })
        }
        else { res.writeHead(404).end() }
    }
    else if (urlObj.pathname == '/api/users/login') {        
        if (req.method == 'POST') {
            res.writeHead(200, _jsonType)
            let chunks = []
            req.on("data", chunk => chunks.push(chunk))
            req.on("end", () => {
                let loginInfo = JSON.parse(Buffer.concat(chunks).toString())
                let user = null;
                for (let i = 0; i < _users.length; i++) {
                    if (_users[i].email == loginInfo.email) {
                        user = _users[i]
                    }
                }

                let reply
                if (user) {
                    if (user.password == loginInfo.password) {
                        reply = { valid: true, msg: '登入成功' }
                        res.write(JSON.stringify(reply))
                        res.end()
                    }
                    else {
                        reply = { valid: false, msg: '密碼錯誤' }
                        res.write(JSON.stringify(reply))
                        res.end()
                    }
                }
                else {
                    reply = { valid: false, msg: '無此帳號' }
                    res.write(JSON.stringify(reply))
                    res.end()
                }
            })
        }
        else {
            res.writeHead(404).end()
        }

    }
    else if (urlObj.pathname == '/favicon.ico') { res.end(); }
    else {
        console.log("STRANGE PATHNAME", urlObj.pathname)
        res.end()
    }
});*/

//server.listen(3000, () => console.log('SERVER PORT 3000'))
app.listen(3000, () => console.log('APP PORT 3000'))

