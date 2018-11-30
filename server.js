const http = require("http");
const fs = require("fs");

const express = require('express');
const bodyparser = require('body-parser');

const htmlFolder = fs.readdirSync("./public/html");
const cssFolder = fs.readdirSync("./public/css");
const jsFolder = fs.readdirSync("./public/js");
const resFolder = fs.readdirSync("./public/res");

const portOptions = {
    hostname : 'localhost',
    port : process.env.PORT || 3000
};

var app = express();
app.use(bodyparser.json({'limit' : '10mb'}));

app.get('*', function(req,res){

    var fileType;
    var fileName;

    if(req.url == '/'){
        fileType = 'html';
        fileName = 'skeleton.html';
    }else{
		var typeArray=req.url.split(".");
		var nameArray=req.url.split("/")
        fileType = typeArray[typeArray.length-1];
        fileName = nameArray[nameArray.length-1];
    }
	
    var fileLoaded = false;
    if(fileType == 'html'){
        for(var i = 0; i < htmlFolder.length; i++){
            if(htmlFolder[i] == fileName){
                res.status(200).sendFile(__dirname + '/public/html/' + htmlFolder[i]);
                console.log('==loaded: ' + htmlFolder[i]);
                fileLoaded = true;
                break;
            }
        }
    }else if(fileType == 'css'){
        for(var i = 0; i < cssFolder.length; i++){
            if(cssFolder[i] == fileName){
                res.status(200).sendFile(__dirname + '/public/css/' + cssFolder[i]);
                console.log('==loaded: ' + cssFolder[i]);
                fileLoaded = true;
                break;
            }
        }
    }else if(fileType == 'js'){
        for(var i = 0; i < jsFolder.length; i++){
            if(jsFolder[i] == fileName){
                res.status(200).sendFile(__dirname + '/public/js/' + jsFolder[i]);
                console.log('==loaded: ' + jsFolder[i]);
                fileLoaded = true;
                break;
            }
        }
    }else if(fileType == 'png' || fileType == 'PNG'){
        for(var i = 0; i < resFolder.length; i++){
            if(resFolder[i] == fileName){
                res.status(200).sendFile(__dirname + '/public/res/' + resFolder[i]);
                console.log('==loaded: ' + resFolder[i]);
                fileLoaded = true;
                break;
            }
        }
    }else if(fileType == 'jpg' || fileType == 'JPG'||fileType == 'jpg'){
        for(var i = 0; i < resFolder.length; i++){
            if(resFolder[i] == fileName){
                res.status(200).sendFile(__dirname + '/public/res/' + resFolder[i]);
                console.log('==loaded: ' + resFolder[i]);
                fileLoaded = true;
                break;
            }
        }
    }else if(fileType == 'ico'){
        res.status(200).sendFile(__dirname + '/public/favicon.ico');
        console.log('==loaded: favicon.ico');
        fileLoaded = true;
    }else if(fileType == 'json'){
        res.status(200).sendFile(__dirname + '/public/image-data.json');
        console.log('==loaded: image-data.json');
        fileLoaded = true;
    }

    if(!fileLoaded){
        res.status(404).sendFile(__dirname + "/public/html/404-page.html");
        console.log("==ERROR: FILE NOT FOUND");
    }
});

app.post('*',function(req,res){
    if(req.url == '/image'){
        fs.readFile(__dirname + '/public/image-data.json','utf8',function(err,raw){
            if(err){
                throw err;
            }
            var data = JSON.parse(raw);
            data.push(req.body);
            var json = JSON.stringify(data,null,4);
            fs.writeFile(__dirname + '/public/image-data.json',json,function(){
                res.status(200).send("Image saved successfully");
            });
        });
    }
});

app.listen(portOptions, function(err){
    if(err){
        throw err;
    }else{
        console.log('==Listening on Port:' + portOptions.port);
    }
});
