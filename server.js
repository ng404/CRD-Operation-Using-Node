const express=require('express')
const app=express()
const PORT=process.env.PORT || 6000

// require('./models/user')
// require('./models/post')
// require('./models/message')
app.use(express.json())
app.use(require('./routes/route'))
// app.use(require('./routes/post'))
// app.use(require('./routes/user'))


// if(process.env.NODE_ENV=="production"){
//     app.use(express.static('client/build'))
//     const path=require('path')
//     app.get("*",(req,res)=>{
//         res.sendFile(path.resolve(__dirname,'client','build','index.html'))
//     })
// }

app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})

module.exports = app;