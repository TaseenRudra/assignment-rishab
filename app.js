const express=require("express");

const bodyparser=require("body-parser");

let app=express();

app.use(bodyparser.urlencoded({ extended: false }))


app.use(bodyparser.json())

const port=3000;

const mongoose=require("mongoose");

app.listen(port,()=>
{
    console.log(` server is listening to port ${port}`);
})


mongoose.connect("mongodb://127.0.0.1:27017/newdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;

db.on("error", () => console.log("error connecting to database"));

db.once("open", () => console.log("Connected to database"));

app.post("/sendData",(req,res)=>
{
    try{
    validatePostdata(req.body.item).then(function(result)
{
    if(result.isValidated)
        {
            const {name,email}=req.body.item;
            let item={
                name:name,
                email:email,
            }
            db.collection('userData').insertOne(item, function (err, result) {
                
                console.log('item has been inserted',result);
                res.json({isActionSuccess:true});
              
            });

        }
        else{
           res.json({isActionSuccess:false,message:result.message});
        }

})
   
}
catch(ex)
{   console.error("An unknown error occured",ex);
    res.status(500).json({message:"An unknown error occured"});

}


});

function validatePostdata(data)
{
    return new Promise((resolve,reject)=>
    {
        if(!data)
        {
            resolve({isValidated:false,message:"Please provide the data to save"});
        }
        else if(!data.name)
            {
                resolve({isValidated:false,message:"Please provide the name to save"});

            }
        else if(data.name && data.name.length==0)
            {
                resolve({isValidated:false,message:"Please provide the name to save"});
            }
        else if(!data.email)
            {
                resolve({isValidated:false,message:"Please provide the email to save"});
            }
        else if(data.email && data.email.length==0)
            {
                resolve({isValidated:false,message:"Please provide the email to save"});
            }
            else{
                resolve({isValidated:true});
            }


    })
}
app.get("/getData",async(req,res)=>
{
    try{
        db.collection('userData').findOne().then(function(result)
    {
       
        res.json({isActionSuccess:true,data:result});
    })

    }
    catch(ex){
        console.error("An unknown error occured",ex);
        res.status(500).json({message:"An unknown error occured"});
    }
   
})

app.delete("/delete",(req,res)=>
{
   
try{

    db.collection('userData').deleteMany( { name: req.body.name } ).then(function(result)
    {
        res.json({isActionSuccess:true});
    })

}
catch(ex)
{
    console.error("An unknown error occured",ex);
    res.status(500).json({message:"An unknown error occured"});
}

})










