import { rename } from "fs";

rename('vite.config.js', 'vite.config.js.temp', function (err) { if (err) throw err; }); // rename original config to other
rename('vite.config.js.gh', 'vite.config.js', function (err) { if (err) throw err; }); // rename gh config to current