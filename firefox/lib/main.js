const data = require("sdk/self").data;
const pageMod = require("sdk/page-mod");
pageMod.PageMod({
  include: [
    "http://sources.debian.net/src/*",
    "https://sources.debian.net/src/*"
  ],
  contentScriptFile: data.url("loader.js")
});
