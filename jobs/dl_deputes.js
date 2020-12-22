const { program } = require('commander');
const puppeteer = require('puppeteer');
const fs = require('fs');
const Bottleneck = require('bottleneck');
const {getdeputeData} = require('./dl_depute.js')
const {fetchUrls} = require("./fetcher/an_www.js")
const {closeBrowser} = require("./fetcher/misc/browser.js")

async function getDeputesData(opt) {
  var datum;
  try {
      var urls;
      if (opt.onlyOne === true) {
        urls=[`http://www2.assemblee-nationale.fr/deputes/fiche/OMC_PA605036`]
      } else if(opt.onlyOne) {
        urls=[`http://www2.assemblee-nationale.fr/deputes/fiche/OMC_${opt.onlyOne}`]
      } else {
        urls = await fetchUrls(opt)
      }
      console.log(`Found ${urls.length} urls`, urls.slice(0, 10));
      const limiter = new Bottleneck({ maxConcurrent: 20 });
      var i= 0
      async function counted(url) {
        const data = await getdeputeData(url, opt)
        opt.verbose && console.log(`${i++}/${urls.length}`)
        opt.verbose && console.log(data)
        return data
      }
      const tasks = urls.map((url) => limiter.schedule(() => counted(url)));
      datum = await Promise.all(tasks)
      let jsonstr = JSON.stringify(datum, null, ' ');
      fs.writeFileSync(`${opt.dlfolder}/deputes.json`, jsonstr);
  } catch (err) {
      console.log("Error while fetching deputes", err);
  }
  return datum
}

async function main() {
  program
    .description(`Download depute data into dl/deputes.json.`)
    .option('-f, --dlfolder <folder>' , 'download folder', "dl/")
    .option('-i, --dl-img', 'download depute pic')
    .option('-d, --debug', 'run puppeteer headless')
    .option('-c, --config-file <file>' , 'config.json file path', 'config.json')
    .option('--only-one [uid]', 'download only the one depute for debugging purpose. depute uid ex: PA722170')
    .option('-v, --verbose', 'log what\'s happening')
    .option('--no-mkdir')
    .option('--override')
    .option('--step <step-name>', '', 'default')
    .option('--show-step')
    .parse(process.argv);
  const start = Date.now();
  await getDeputesData(program)
  await closeBrowser()
  const millis = Date.now() - start;
  console.log(`seconds elapsed = ${Math.floor(millis / 1000)}`);
}

if (require.main === module) main()

module.exports = {getDeputesData}
