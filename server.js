const express = require("express");
var bodyParser = require('body-parser')
var cors = require('cors')
const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('70434fe76cbd07eaa0094038542481b6ece6582c');
var urlExpander=require('expand-url');
const app=express();
const port=process.env.PORT || 3000;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set('view engine', 'ejs')//Setting the view Engine
app.use(express.static('public'))//creating a relative path to look for static files

app.get('/',(req,res)=>{
  res.render("./index.ejs");
})
app.get('/about',(req,res)=>{
    res.render("./about.ejs");
})
function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
  }
app.post('/message', async (req,res)=>{
    var x=req.body.url;
    urlExpander.expand(x, function(err, longUrl){
        if(longUrl.includes("amazon")){
            const tagName="freedeals0c-21";
            longUrl=updateQueryStringParameter(longUrl,"tag",tagName);
            console.log(longUrl)
        }
        bitly.shorten(longUrl)
        .then((response=>{
            console.log(`Your shortened bitlink is ${response.link}`);
            res.send(response.link);
        }))
    });
})
app.listen(port,()=>console.log("Listning on port "+port))



