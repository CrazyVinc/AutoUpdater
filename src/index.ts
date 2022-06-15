var os = require("os");
import http from "https";
import fs from "fs";

export class autoUpdater {
    public url: string;
    public downloadurl: string;
    public dest: string;
    public useragent: string;

    constructor(options: {
        remoteJSON: string, // The URL where we can get the remote version (JSON)
        downloadURL: string, // The URL where the download file is located.
        dest?: string
        useragent?: string
    }) {
        if (options.dest === undefined) options.dest = "./temp/dl.zip";
        if (options.useragent === undefined) options.useragent = `NodeJS/${process.version} (${process.platform};${process.arch}) AutoUpdater/1.0.0`;
        this.url = options.remoteJSON;
        this.downloadurl = options.downloadURL;
        this.dest = options.dest;
        this.useragent = options.useragent;
    }


    getRemoteVersion = (URL?: string) => {
        return new Promise((resolve, reject) => {
            var url = this.url;

            if (URL !== undefined) url = URL;
            if (url === undefined) {
                reject(new Error("No URL specified!"));
                return;
            };

            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": this.useragent,
                },
            };

            const req = http.request(url, options, (response) => {
                var str = "";
                response.on("data", function (chunk) {
                    str += chunk;
                });

                response.on("end", function () {
                    try {
                        resolve(str);
                    } catch (err) {
                        reject(err);
                    }
                });
            }
            );
            req.end();
        });
    }

    download = (url?: string, destination?: string) => {
        return new Promise((resolve, reject) => {
            if (this.downloadurl === undefined || (url && destination) === undefined) {
                reject(new Error(`Download cancelled. Missing required parameter downloadURL`));
                return;
            };
            var downloadurl = this.downloadurl;
            var dest = this.dest;

            if (url !== undefined) downloadurl = url;
            if (destination !== undefined) dest = destination;

            var file = fs.createWriteStream(dest);
            const options = {
                method: "GET",
                headers: {
                    "User-Agent": this.useragent,
                },
            };

            var req = http
                .request(downloadurl, options, function (res) {
                    res.pipe(file);
                    file.on("finish", function () {
                        file.close();
                        resolve(file);
                    });
                })
                .on("error", (err) => {
                    // Handle errors
                    fs.unlink(dest, (unlinkErr) => {
                        if (unlinkErr) reject(unlinkErr);
                        reject(err);
                    });
                });
            req.end();
        });
    }

    defaultUpdater = (folder?: string) => {
        return new Promise((resolve, reject) => {
            if (folder === undefined) folder = "updaters";
            if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
            var platform = os.platform();
            var arch = os.arch();

            this.getRemoteVersion(`https://cdn.crazyvinc.nl/npm/autoupdater/updaters.json`).then((result: any) => {
                result = JSON.parse(result);
                if (result?.[platform] === undefined &&
                    result?.[platform]?.[arch] === undefined ) return reject("No platform found.");
                this.download(`https://cdn.crazyvinc.nl/npm/autoupdater/${result[platform][arch]}`,
                    `${folder}/${result[platform][arch]}`).then((result: any) => {
                        resolve(result);
                    }).catch((err) => {
                        reject(err)
                    });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}