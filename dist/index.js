"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoUpdater = void 0;
var os = require("os");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
class autoUpdater {
    constructor(options) {
        this.getRemoteVersion = (URL) => {
            return new Promise((resolve, reject) => {
                var url = this.url;
                if (URL !== undefined)
                    url = URL;
                if (url === undefined) {
                    reject(new Error("No URL specified!"));
                    return;
                }
                ;
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": this.useragent,
                    },
                };
                const req = https_1.default.request(url, options, (response) => {
                    var str = "";
                    response.on("data", function (chunk) {
                        str += chunk;
                    });
                    response.on("end", function () {
                        try {
                            resolve(str);
                        }
                        catch (err) {
                            reject(err);
                        }
                    });
                });
                req.end();
            });
        };
        this.download = (url, destination) => {
            return new Promise((resolve, reject) => {
                if (this.downloadurl === undefined || (url && destination) === undefined) {
                    reject(new Error(`Download cancelled. Missing required parameter downloadURL`));
                    return;
                }
                ;
                var downloadurl = this.downloadurl;
                var dest = this.dest;
                if (url !== undefined)
                    downloadurl = url;
                if (destination !== undefined)
                    dest = destination;
                var file = fs_1.default.createWriteStream(dest);
                const options = {
                    method: "GET",
                    headers: {
                        "User-Agent": this.useragent,
                    },
                };
                var req = https_1.default
                    .request(downloadurl, options, function (res) {
                    res.pipe(file);
                    file.on("finish", function () {
                        file.close();
                        resolve(file);
                    });
                })
                    .on("error", (err) => {
                    // Handle errors
                    fs_1.default.unlink(dest, (unlinkErr) => {
                        if (unlinkErr)
                            reject(unlinkErr);
                        reject(err);
                    });
                });
                req.end();
            });
        };
        this.defaultUpdater = (folder) => {
            return new Promise((resolve, reject) => {
                if (folder === undefined)
                    folder = "updaters";
                if (!fs_1.default.existsSync(folder))
                    fs_1.default.mkdirSync(folder, { recursive: true });
                var platform = os.platform();
                var arch = os.arch();
                this.getRemoteVersion(`https://cdn.crazyvinc.nl/npm/autoupdater/updaters.json`).then((result) => {
                    var _a;
                    result = JSON.parse(result);
                    if ((result === null || result === void 0 ? void 0 : result[platform]) === undefined &&
                        ((_a = result === null || result === void 0 ? void 0 : result[platform]) === null || _a === void 0 ? void 0 : _a[arch]) === undefined)
                        return reject("No platform found.");
                    this.download(`https://cdn.crazyvinc.nl/npm/autoupdater/${result[platform][arch]}`, `${folder}/${result[platform][arch]}`).then((result) => {
                        resolve(result);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        };
        if (options.dest === undefined)
            options.dest = "./temp/dl.zip";
        if (options.useragent === undefined)
            options.useragent = `NodeJS/${process.version} (${process.platform};${process.arch}) AutoUpdater/1.0.0`;
        this.url = options.remoteJSON;
        this.downloadurl = options.downloadURL;
        this.dest = options.dest;
        this.useragent = options.useragent;
    }
}
exports.autoUpdater = autoUpdater;
