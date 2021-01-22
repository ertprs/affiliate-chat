const express = require("express");
var bodyParser = require('body-parser')
const urlMetadata = require('url-metadata')
var cors = require('cors')
const unlimited_bitly = require('@waynechang65/unlimited-bitly');
const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('262cbd72344da65ff07669570da0746dd6040d99');
var urlExpander=require('expand-url');
const app=express();
const port=process.env.PORT || 3000;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set('view engine', 'ejs')//Setting the view Engine
app.use(express.static('public'))//creating a relative path to look for static files


const BITLY_KEYS = [
  "17b33ac5407436e4345af050a8e838281792f80e",
  "f2ff7682686e8ddecd4d2691f9a924050c0ad214",
  "bc6785da61a688065026f8660f48671515694417",
  "1dc88a07828e5463da55ad8acbfa746d88f6221e",
  "002231692c61aa7eb682946e82e6888f07950180",
  "b14d4c2ffb73c95b41c35142aa31d98f49afd640",
  "9318d9a9ed47f503a0fe3e66007c64eb0c9fd6af",
  "4408dfdc8867f48e9d5c1fca61c6238ab002df52",
  "c12ef072c8c55a8454db7489b96ed7772e787dff",
  "ab41ae65e0aaae6641e430bb4c3f348c2e99b105",
  "f2b390dbe6d09c84e62a54cf0c904874a674a219",
  "cfc0a4d65545684fe9f40fa03949d847d180fd7d",
  "bebe2116c016a19f019a875df822b221da3d4f92",
  "ebe5029dc136f3f6b7cbbde2e66dfddc2a704fde",
  "e1dc43f2cf2e659f8d7c32d5e70ab2e961d58358",
  "4c33daeb7500649eab146ceee37c66d56169bd72",
  "b4d04f6bcd20d88f5385f316ae965fe9faccc8dc",
  "fc7c9dc1b80ad42af34dbcbd5dbce66ac39c2f3a",
  "67c62d9e3729657a4280f1fe798216f5d7bc5a38",
  "70434fe76cbd07eaa0094038542481b6ece6582c",
  "c939c4a909c7f85a5345804671fe1fb0dd686a3f",
  "28f94cd2a77055a6ce638baa6e304bbfbde5620f"
];
let ubitly = unlimited_bitly.init(BITLY_KEYS);
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
      urlMetadata(longUrl).then(
        function (metadata) { // success handler
          longUrl=(metadata['og:url'])
          if(longUrl.includes("amazon")){
              const tagName="freedeals0c-21";
              longUrl=updateQueryStringParameter(longUrl,"tag",tagName);
              console.log(longUrl)
          }
          ubitly.shorten(longUrl)
          .then((response=>{
              console.log(`Your shortened bitlink is ${response}`);
              res.send(response);
          })).catch(err=>console.log(err.message))
        },
        function (error) { // failure handler
          console.log(error)
        })
    });
})
app.listen(port,()=>console.log("Listning on port "+port))



