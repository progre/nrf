import { app, Menu } from "electron";

export function initMacMenu() {
    if (process.platform !== "darwin") {
        return;
    }
    let template = [{
        label: "Edit",
        submenu: <any[]>[
            {
                label: "Undo",
                accelerator: "CmdOrCtrl+Z",
                role: "undo"
            },
            {
                label: "Redo",
                accelerator: "Shift+CmdOrCtrl+Z",
                role: "redo"
            },
            {
                type: "separator"
            },
            {
                label: "Cut",
                accelerator: "CmdOrCtrl+X",
                role: "cut"
            },
            {
                label: "Copy",
                accelerator: "CmdOrCtrl+C",
                role: "copy"
            },
            {
                label: "Paste",
                accelerator: "CmdOrCtrl+V",
                role: "paste"
            },
            {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                role: "selectall"
            }
        ]
    }];

    let name = app.getName();
    template.unshift({
        label: name,
        submenu: [
            {
                label: "About " + name,
                role: "about"
            },
            {
                type: "separator"
            },
            {
                label: "Services",
                role: "services",
                submenu: []
            },
            {
                type: "separator"
            },
            {
                label: "Hide " + name,
                accelerator: "Command+H",
                role: "hide"
            },
            {
                label: "Hide Others",
                accelerator: "Command+Shift+H",
                role: "hideothers"
            },
            {
                label: "Show All",
                role: "unhide"
            },
            {
                type: "separator"
            },
            {
                label: "Quit",
                accelerator: "Command+Q",
                click: () => app.quit()
            }
        ]
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
