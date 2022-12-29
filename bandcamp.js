const path = require('path');
const readline = require('readline/promises')
const jsdom = require('jsdom')
const https = require('https')
const fs = require("fs")
const got = require('got')

const { JSDOM } = jsdom;
const rl = readline.createInterface({
  input: process.stdin, 
  output: process.stdout
});



var audio;


async function x(){ 
  const x = await rl.question('Input URL: ')
  got(x).then(response => {
    const dom = new JSDOM(response.body);

    // normally we would look in the head but to conform to the specs we search in the body
    const source = dom.window.document.querySelectorAll('script')[4].getAttribute('data-tralbum') 
    const data = JSON.parse(source)
    
      if (data.trackinfo[0].file === null) {
          throw TypeError('No download avaliable');
      } else {
        var audio = data.trackinfo[0].file["mp3-128"];
        console.log(audio)
        https.get((audio),
          (response)=>{
          const filepath = path.join(__dirname, `/${data.trackinfo[0].title}.mp3`);
          const writeStream = fs.createWriteStream(filepath);
      
          response.pipe(writeStream);
      
          writeStream.on("finish", () => {
            writeStream.close();
            console.log(`${filepath} downloaded!`); /*new additions*/
            console.log(fs.readdirSync(__dirname))
          process.exit()
          }
          )
        }
        )
      }

  }
  ).catch(err => {
    console.log(err);
  }
  );
};



x();
