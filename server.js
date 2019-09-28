// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const http = require('http');
const manchu = require('./ManchuCore')

function tag(text, tag){
  return ("<" + tag + ">" + text + "</" + tag + ">" )
}
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + process.env.PORT)
}
);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const _ = require('lodash/object')
const csvFilePath = 'dicts.csv'
const csv = require('csvtojson')
var Datastore = require('nedb')
  , db = new Datastore();

csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    var trimmed = jsonObj.map(i => {
      i.zh = i.zh.split(' | ')
      i.m = i.m.replace(/&nbsp;/g, ' ')
      i.r = i.r.replace(/&nbsp;/g, ' ')
      return _.pick(i, ['m', 'r', 'zh'])
    })
    db.insert(trimmed, function (err, newDoc) { 
});
}) 


const Telegraf = require("telegraf")
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use((ctx, next) => {
  const start = new Date()
  return next(ctx).then(() => {
    const ms = new Date() - start
    console.log('Response time %sms', ms)
  })
})


bot.on('text', (ctx) => {
  
  var t = ctx.message.text
  try {
  if (escape(t).indexOf( "%u" ) >= 0){
   var statement = {zh : new RegExp(t)}
  }else{
    if (manchu.isManchuScript(t)){
      var statement= {m : new RegExp(t,"gim")}
    } else {
      var statement = {r : new RegExp(t, "gim")}
    }
  }
  }catch(err){
    console.log (err) 
    return ctx.reply(err)
  }
  db.find(statement, function (err, docs) {
    if (err) {
      console.log (err) 
      return ctx.reply(err)
    }
    
    //docs = docs.slice(1)
    var l = docs.length
   if (l > 30){
     docs = docs.slice(0,30)
   }
    var o
    
    docs.map(e => {
      var i
      i = [tag(e.m, "b"), tag(e.r, "code"), e.zh.join("；")].join(" ")
      {
        o += i + "\n"
      }
      //console.log (i)
    })
     //docs = "RESULTS OVERFLOW"
    //console.log(o)
    o = tag(t, "b") + ":\n" + o + tag(l + " result(s)", 'i')
    o = o.replace ("undefined", "")
    
    ctx.replyWithHTML(o)
});

})
//bot.command("")
bot.launch()
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});