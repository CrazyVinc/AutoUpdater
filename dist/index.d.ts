export declare class autoUpdater {
    url: string;
    downloadurl: string;
    dest: string;
    useragent: string;
    constructor(options: {
        remoteJSON: string;
        downloadURL: string;
        dest?: string;
        useragent?: string;
    });
    getRemoteVersion: (URL?: string) => Promise<unknown>;
    download: (url?: string, destination?: string) => Promise<unknown>;
    defaultUpdater: (folder?: string) => Promise<unknown>;
}
