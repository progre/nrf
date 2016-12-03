import { app } from "electron";
import * as fs from "fs";
import * as uuid from "node-uuid";
import * as _ua from "universal-analytics";
const ua: _ua = require("universal-analytics");
import * as tld from "tldjs";
import { ServiceConfig } from "../valueobjects";

export default class Analytics {
    private visitor: _ua.Client;
    private applies = new Map<string, Date>();

    static async create() {
        let path = app.getPath("userData") + "/id";
        let id = await new Promise<string>((resolve, reject) => {
            fs.readFile(path, "UTF-8", (err, data) => {
                if (err == null) {
                    resolve(data);
                    return;
                }
                let newId = uuid.v4();
                fs.writeFile(path, newId, err2 => {
                    if (err2 == null) {
                        resolve(newId);
                        return;
                    }
                    reject(err2);
                });
            });
        });
        return new this(id);
    }

    private constructor(id: string) {
        this.visitor = ua("UA-43486767-18", id);
        this.visitor.pageview("/").send();
    }

    send(serviceConfigs: ServiceConfig[]) {
        let list = serviceConfigs
            .filter(x => x.enabled)
            .map(x => ({
                server: <string>tld.getDomain(x.fmsURL),
                pushBy: x.pushBy
            }))
            .filter(x => x.server != null);
        for (let item of list) {
            let mapKey = item.server + "-" + item.pushBy;
            let before = this.applies.get(mapKey);
            let now = new Date();
            this.applies.set(mapKey, now);
            if (before != null && now.getDate() < before.getDate() + 1 * 60 * 60 * 1000) {
                continue;
            }
            this.visitor.event(
                "Settings",
                "Apply",
                item.server,
                item.pushBy === "nginx" ? 0 : 1
            ).send();
        }
    }
}
