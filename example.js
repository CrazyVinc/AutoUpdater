const { autoUpdater } = require("./src/index.js");

var localVersion = "90a506ad0265fe68718f5eb571bbec80a9ed4b14";
var url =
    "https://raw.githubusercontent.com/CrazyVinc/LED-Controller/master/AutoUpdater.json";

const downloader = new autoUpdater({
    remoteJSON: url,
    downloadURL: url,
});

downloader
    .getRemoteVersion()
    .then((result) => {
        result = JSON.parse(result);
        if (result.hash !== localVersion) {
            downloader
                .defaultUpdater()
                .then((result) => {
                    console.log(result.path, 2);
                })
                .catch((err) => {
                    console.log(-2, err);
                });
        }
    })
    .catch(function (error) {
        console.log(-1, error);
    });
