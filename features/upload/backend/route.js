'use strict';

module.exports = function (component, app) {

    let controller = component.controllers.backend;
    let permissions = ['upload_manage', 'upload_manage_all'];

    return {
        "/uploads/dirtree": {
            post: {
                handler: controller.dirTree,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/createdir": {
            post: {
                handler: controller.createDir,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/deletedir": {
            post: {
                handler: controller.deleteDir,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/movedir": {
            post: {
                handler: controller.moveDir,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/copydir": {
            post: {
                handler: controller.copyDir,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/renamedir": {
            post: {
                handler: controller.renameDir,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/fileslist": {
            post: {
                handler: controller.fileList,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/upload": {
            post: {
                handler: controller.upload,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/download": {
            post: {
                handler: controller.download,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/downloaddir": {
            post: {
                handler: controller.downloadDir,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/deletefile": {
            post: {
                handler: controller.deleteFile,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/movefile": {
            post: {
                handler: controller.moveFile,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/copyfile": {
            post: {
                handler: controller.copyFile,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/renamefile": {
            post: {
                handler: controller.renameFile,
                authenticate: true,
                permissions: permissions
            }
        },
        "/uploads/thumb": {
            get: {
                handler: controller.thumb,
                authenticate: true,
                permissions: permissions
            }
        }

    }
};

