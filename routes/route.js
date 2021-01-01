const { raw } = require('express');
const express =require('express')
const router =express.Router()
var fs = require('fs');
const path = 'CRD.json'


//API for creating a file or writing into the file
router.post('/create',(req,res)=>{
    const {key,value}=req.body
    if(!key || !value){
        return res.status(422).json({error:"please provide the key-value pair!!"})
    }
    //check key is of string type or not
    if(typeof key!='string'){
        return res.status(422).json({error:"Please Provide a valid string key!!"})
    }
    //check value is of JSON Object or not
    try {
        var checker=JSON.parse(JSON.stringify(value));
        if(!('Time_To_Live' in checker)){
            return res.status(422).json({error:"Please Provide a Time To Taken value to the paticular key!!"})
        }
    } catch (e) {
        return res.status(422).json({error:"Please Provide a valid Json Object value!!"})
    }
    try {
        //checking file exist or not
    if (fs.existsSync(path)) {
        fs.readFile(path, (err, data) => {
            //if file exists and the content of file is blank then this if  will execute
            if(data==""){
                value['created_timestamp']=new Date();
                let data1 = { 
                    [key]: value,
                };
                //writing new content to the file
                fs.writeFileSync(path, JSON.stringify(data1, null, 2));
                return res.json(data1);
            }
            else{

                let file_content = JSON.parse(data);
                //deleting the key-value pair whose Time_To_Taken is over
                for(var attributename in file_content){
                    let key_content = JSON.parse(JSON.stringify(file_content[attributename]));
                    var startDate = new Date(key_content.created_timestamp);
                    var endDate = new Date();
                    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                    if(seconds>=key_content['Time_To_Live']){
                            delete file_content[attributename];
                    }
                }
                if(key in file_content){
                    return res.json({"error":"Key Already Exist"})
                }
                value['created_timestamp']=new Date();
                //writing new key in the object
                file_content[key]=value;
                //checking the size of the file
                fs.stat("CRD.json", (err, fileStats) => {
                    if (err) {
                      console.log(err)
                    } else {
                        //if filesize greater then 1GB it will retrun an error
                      if(fileStats.size>=(1*1000*1000*1000)){
                        return res.json({"error":"File Size is greater then 1GB So can't Insert into the file!!"})
                      }
                    }
                  })
                //writing new content to the file
                fs.writeFileSync(path, JSON.stringify(file_content, null, 2));
                return res.json(file_content);
            }                
        });
    }
    else{
        value['created_timestamp']=new Date();
        let data1 = { 
            [key]: value,
        };
        let data2 = JSON.stringify(data1, null, 2);
        //creating new file and writing new content to the file 
        fs.writeFile(path,data2, (err) => {
            if (err)  throw err;
        }); 
        return res.json(data1);
    }
    } catch(err) {
     return res.json({"error":err})
    }
})
// API for reading JSON Object from the file
router.post('/read',(req,res)=>{
    const {key}=req.body
    //if key provided by the user id undefined then it will return all data from the file
    if(key==undefined)
    {
        try{
            //read file
        fs.readFile(path, (err, data) => {
            if(err) return res.json({"error":err})
            if(data==""){
                return res.json("No Data Is present In File!!!");
            }
            else{
                let file_content = JSON.parse(data);
                //deleting the key-value pair whose Time_To_Taken is over
                for(var attributename in file_content){
                    let key_content = JSON.parse(JSON.stringify(file_content[attributename]));
                    var startDate = new Date(key_content.created_timestamp);
                    var endDate = new Date();

                    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                    if(seconds>=key_content['Time_To_Live']){
                            delete file_content[attributename];
                    }
                }
                //writing content to the file after deleting the time over key-value pair
                fs.writeFileSync(path, JSON.stringify(file_content, null, 2));
                return res.json(file_content);
            }                
        });
    }
    catch(err){
        return res.json({"error":err})
    }
    }
    else{
        fs.readFile(path, (err, data) => {
            if(err) return res.json({"error":err});
            if(data==""){
                return res.json("No Data Is present In File!!!");
            }
            else{
                let file_content = JSON.parse(data);
                //deleting the key-value pair whose Time_To_Taken is over
                for(var attributename in file_content){
                  
                    let key_content = JSON.parse(JSON.stringify(file_content[attributename]));
                    var startDate = new Date(key_content.created_timestamp);
                    var endDate = new Date();

                    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                    
                    if(seconds>=key_content['Time_To_Live']){
                            delete file_content[attributename];
                    }
                }
                //writing content to the file after deleting the time over key-value pair
                fs.writeFileSync(path, JSON.stringify(file_content, null, 2));
                //check key is present or not
                if(key in file_content){
                    let data={
                        [key]:file_content[key]
                    }
                    return res.json(data);
                }
                else{
                    return res.json("Key Is Not Present!!!");
                }
                
            }                
        });
    }
})
//API for delete the respective key from the file
router.delete('/delete/:key',(req,res)=>{
    const key=req.params.key;
    //read file
    fs.readFile(path, (err, data) => {
        if(err) return res.json({"error":err});
        if(data==""){
            return res.json({"Error":"No Data Is present In File!!!"});
        }
        else{
            let file_content = JSON.parse(data);
            //deleting the key-value pair whose Time_To_Taken is over
            for(var attributename in file_content){
                let key_content = JSON.parse(JSON.stringify(file_content[attributename]));
                var startDate = new Date(key_content.created_timestamp);
                var endDate = new Date();
                var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                
                if(seconds>=key_content['Time_To_Live']){
                        delete file_content[attributename];
                }
            }
            //writing into file after deleting time over key-value pair
            fs.writeFileSync(path, JSON.stringify(file_content, null, 2));
            //check key is present or not
            if(key in file_content){
                delete file_content[key];
            }
            else{
                return res.json({"error":"Key Is Not Present!!!"});
            }
            let data2 = JSON.stringify(file_content, null, 2);
            fs.writeFileSync(path, data2);
            return res.json(file_content);
        }                
    });

});

module.exports =router  