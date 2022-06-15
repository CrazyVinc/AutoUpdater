# AutoUpdater
This update system is used in [@CrazyVinc/Led-Controller](https://github.com/CrazyVinc/Led-Controller)

### Features
- Get remote version from JSON
- Download the update.
- Extractor with the function to specify what to extract
- Run npm install with the default extractor
- Automatically download the correct extractor.
- Define your own extractor


### Example to run the default updater and run npm install
> `autoupdater -dest=./ -zip=./temp/update.zip -extractfile=installer.json -npm`

### To use the built-in extractor, You can define what to extract:
> ```json
> {
>    "extract": {
>        "files": [
>            "/index.js",
>            "/installer.json",
>            "/package.json"
>        ],
>        "directories": [
>            "/src"
>        ]
>    }
> }
>```

# Recommend use:
1. Use a launcher to run your main program.
2. Let your program scan for updates in the background.
3. If a update is found, install the update and the extractor.
4. Let your main program communicate to your launcher that there is a update ready to install.
   - Send a JSON object with the path to the update and the path to the extractor
   - Send a prepared commandline string.
5. Let the launcher stop your program and start the update-extractor (with child process spawn).
6. Start your main program as soon the update-extractor is closed.

> You can use the [@CrazyVinc/Led-Controller Launcher](https://github.com/CrazyVinc/LED-Controller/commit/d33a68da8258ab8b0434db7aa9eb7b5ce52105a1) and change it according to your own use