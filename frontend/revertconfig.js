import { rename } from "fs";

rename('vite.config.js', 'vite.config.js.gh', function (err) { if (err) throw err; }); // rename current config to gh
rename('vite.config.js.temp', 'vite.config.js', function (err) { if (err) throw err; }); // rename original config to current