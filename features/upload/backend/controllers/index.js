'use strict';

let logger = require('arrowjs').logger;
let fs = require('fs'),
    sizeOf = require('image-size'),
    im = require('imagemagick'),
    formidable = require('formidable'),
    path = require('path'),
    spawn = require('child_process').spawn;

module.exports = function (controller, component, app) {

    let permissionManageAll = 'upload_manage_all';
    let standardPath = __base + 'upload';
    let allowExtension = [
        '.jpg', '.jpeg', '.gif', '.png', '.bmp',
        '.psd', '.pdf',
        '.txt', '.doc', '.docx', '.csv', '.xls', '.xlsx',
        '.zip', '.rar', '.tar', '.gz'
    ];

    function checkFileExist(fileName, index, extension) {
        return new Promise(function (fulfill, reject) {
            fs.access(fileName + '(' + index + ')' + extension, function (err) {
                if (!err) {
                    fulfill(checkFileExist(fileName, parseInt(index) + 1, extension));
                } else {
                    fulfill(fileName + '(' + index + ')' + extension);
                }
            });
        });
    }

    function getFileName(path) {
        return path.replace(/^.*[\\\/]/, '');
    }

    function checkFileType(path) {
        if (~path.indexOf('.png') || ~path.indexOf('.jpg') || ~path.indexOf('.gif') || ~path.indexOf('.jpeg')) {
            return "image";
        } else {
            return "un-know";
        }
    }

    function getExtension(path) {
        return path.split('.').pop();
    }

    function getDirectories(srcpath, results) {
        let files_and_dirs = fs.readdirSync(standardPath + srcpath);
        let totalSubFolders = 0;
        let totalSubFiles = 0;
        let dirs = files_and_dirs.filter(function (file) {
            if (fs.statSync(path.join('upload' + srcpath, file)).isDirectory()) {
                totalSubFolders++;
                return true;
            } else {
                totalSubFiles++;
                return false;
            }
        });

        let p = {
            p: srcpath,
            f: totalSubFiles,
            s: totalSubFolders
        };
        results.push(p);

        for (let i in dirs) {
            results = getDirectories(srcpath + '/' + dirs[i], results);
        }

        return results;
    }

    controller.dirTree = function (req, res) {
        let results = [];
        let rootPath = app.getConfig('uploadPath');
        let userId = req.user.id;
        let ownerPath = standardPath + rootPath + '/users/' + userId;

        // Create dir for user if not exists (dir name = user id)
        fs.access(ownerPath, fs.F_OK, function (err) {
            if (err) {
                fs.mkdir(ownerPath, '7777', function (err) {
                    if (err) {
                        res.jsonp({"res": "error", "msg": "Cannot create directory"});
                    } else {
                        // If user does not have permission manage all, only show his dir
                        if (req.permissions.indexOf(permissionManageAll) === -1) {
                            rootPath += '/users/' + userId;
                        }
                        getDirectories(rootPath, results);
                        res.jsonp(results);
                    }
                });
            } else {
                // If user does not have permission manage all, only show his dir
                if (req.permissions.indexOf(permissionManageAll) === -1) {
                    rootPath += '/users/' + userId;
                }
                getDirectories(rootPath, results);
                res.jsonp(results);
            }
        });
    };

    controller.createDir = function (req, res) {
        let dir = req.body.d;
        let name = req.body.n;

        // Only allow delete dir inside owner folder if user does not have permission manage all
        if (req.permissions.indexOf(permissionManageAll) === -1 &&
            dir.indexOf(app.getConfig('uploadPath') + '/users/' + req.user.id) === -1) {
            res.jsonp({"res": "error", "msg": "You don't have permission to create directory here"});
        } else {
            fs.mkdir(standardPath + dir + '/' + name, '7777', function (err) {
                if (err) {
                    if (err.code == 'EEXIST') {
                        res.jsonp({"res": "error", "msg": "Directory already exists"});
                    } else {
                        res.jsonp({"res": "error", "msg": "Cannot create directory"});
                    }
                } else {
                    res.jsonp({"res": "ok", "msg": ""});
                }
            });
        }
    };

    controller.deleteDir = function (req, res) {
        let dir = req.body.d;

        // Only allow delete dir inside owner folder if user does not have permission manage all
        if (req.permissions.indexOf(permissionManageAll) === -1 &&
            dir.indexOf(app.getConfig('uploadPath') + '/users/' + req.user.id) === -1) {
            res.jsonp({"res": "error", "msg": "You don't have permission to delete this directory"});
        } else {
            // Don't allow delete primary directory
            if (dir == '/fileman/uploads' || dir == '/fileman/uploads/users') {
                res.jsonp({"res": "error", "msg": "Cannot delete this directory"});
            } else {
                fs.rmdir(standardPath + dir, function (err) {
                    if (err) {
                        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_dir_error')});
                    } else {
                        res.jsonp({"res": "ok", "msg": ""});
                    }
                });
            }
        }
    };

    controller.moveDir = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.copyDir = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.renameDir = function (req, res) {
        //let d = req.body.d;
        //let n = req.body.n;
        //let path = d.substring(0, d.lastIndexOf('/'));
        //
        //fs.renameSync(standardPath + d, standardPath + path + '/' + n);
        //res.jsonp({"res": "ok", "msg": ""});
        res.jsonp({"res": "error", "msg": "Cannot rename directory"});
    };

    controller.fileList = function (req, res) {
        let folder = req.body.d;
        let rPath = standardPath + folder;

        // Only show files inside owner folder if user does not have permission manage all
        if (req.permissions.indexOf(permissionManageAll) === -1 &&
            rPath.indexOf(app.getConfig('uploadPath') + '/users/' + req.user.id) === -1) {
            res.jsonp({"res": "error", "msg": "You don't have permission to view this directory"});
        } else {
            fs.readdir(rPath, function (err, files) {
                if (!err) {
                    let result = [];
                    for (let i in files) {
                        let filePath = rPath + '/' + files[i];
                        let sta = fs.statSync(filePath);
                        if (sta.isFile()) {
                            let dimension;

                            try {
                                dimension = sizeOf(filePath);
                            } catch (err) {
                                dimension = {};
                            }

                            let p = {
                                p: folder + "/" + files[i],
                                s: sta.size,
                                t: new Date(sta.mtime).getTime() / 1000,
                                w: dimension.width,
                                h: dimension.height
                            };
                            result.push(p);
                        }
                    }
                    res.jsonp(result);
                }
            });
        }
    };

    controller.upload = function (req, res) {
        let msg = '';

        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            let destination = standardPath + fields.d + '/' + files["files[]"].name;

            // Only show files inside owner folder if user does not have permission manage all
            if (req.permissions.indexOf(permissionManageAll) === -1 &&
                destination.indexOf(app.getConfig('uploadPath') + '/users/' + req.user.id) === -1) {
                msg = "You don't have permission to upload here";
            } else {
                let ext = path.extname(destination).toLowerCase();
                let noExt = destination.replace(/\..*$/, '');

                if (allowExtension.indexOf(ext) !== -1) {
                    fs.access(destination, function (err) {
                        if (!err) {
                            let number = noExt.match(/\(\d\)$/);
                            if (number) {
                                checkFileExist(noExt.replace(/\(\d\)$/, ''), 1, ext).then(function (result) {
                                    fs.rename(files["files[]"].path, result, function (err) {
                                        if (err) logger.error(err);
                                    });
                                });
                            } else {
                                checkFileExist(noExt, 1, ext).then(function (result) {
                                    fs.rename(files["files[]"].path, result, function (err) {
                                        if (err) logger.error(err);
                                    });
                                });
                            }
                        } else {
                            fs.rename(files["files[]"].path, destination, function (err) {
                                if (err) logger.error(err);
                            });
                        }
                    });
                } else {
                    msg = "File type does not allowed";
                }
            }
        });

        form.on('end', function () {
            if (msg) {
                res.jsonp({"res": "error", "msg": msg});
            } else {
                res.jsonp({"res": "ok", "msg": ""});
            }
        });
    };

    controller.download = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.downloadDir = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.deleteFile = function (req, res) {
        let file = req.body.f;
        let filePath = standardPath + file;

        // Only allow delete file inside owner folder if user does not have permission manage all
        if (req.permissions.indexOf(permissionManageAll) === -1 &&
            filePath.indexOf(app.getConfig('uploadPath') + '/users/' + req.user.id) === -1) {
            res.jsonp({"res": "error", "msg": "Cannot delete this file"});
        } else {
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        res.jsonp({"res": "error", "msg": "Cannot delete this file"});
                    } else {
                        let tmp = getFileName(file);
                        let tmp_path = standardPath + '/fileman/tmp/' + tmp;
                        if (fs.existsSync(tmp_path)) {
                            fs.unlinkSync(standardPath + '/fileman/tmp/' + tmp);
                        }
                    }
                    res.jsonp({"res": "ok", "msg": ""});
                });
            } else {
                res.jsonp({"res": "ok", "msg": ""});
            }
        }
    };

    controller.copyFile = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.moveFile = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.renameFile = function (req, res) {
        //let f = req.body.f;
        //let n = req.body.n;
        //let path = f.substring(0, f.lastIndexOf('/'));
        //
        //fs.renameSync(standardPath + f, standardPath + path + '/' + n);
        //
        //// Change name of thumb tmp
        //let tmp = getFileName(f);
        //let tmp_path = standardPath + '/fileman/tmp/' + tmp;
        //if (fs.existsSync(tmp_path)) {
        //    fs.renameSync(tmp_path, standardPath + '/fileman/tmp/' + n);
        //}
        //res.jsonp({"res": "ok", "msg": ""});
        res.jsonp({"res": "error", "msg": "Cannot rename file"});
    };

    controller.thumb = function (req, res) {
        let filePath = req.query.f;
        let width = req.body.width;
        let height = req.body.height;
        let tmpFolder = standardPath + '/fileman/tmp';
        let filename = getFileName(filePath);

        // Only show files inside owner folder if user does not have permission manage all
        if (req.permissions.indexOf(permissionManageAll) === -1 &&
            filePath.indexOf(app.getConfig('uploadPath') + '/users/' + req.user.id) === -1) {
            res.jsonp({"res": "error", "msg": "You don't have permission to view this directory"});
        } else {
            // Check file exit
            if (fs.existsSync(tmpFolder + '/' + filename)) {
                let img = fs.readFileSync(tmpFolder + '/' + filename);
                res.writeHead(200, {'Content-Type': 'image/' + getExtension(filename)});
                res.end(img, 'binary');
            } else {
                // Create thumbnail
                let child = spawn(im.convert.path);
                child.on('error', function (k) {
                    if (fs.existsSync(standardPath + filePath)) {
                        let img = fs.readFileSync(standardPath + filePath);
                        res.writeHead(200, {'Content-Type': 'image/' + getExtension(filename)});
                        res.end(img, 'binary');
                    }
                    res.end(null, 'binary');
                });
                child.on('exit', function (k) {
                    im.resize({
                        srcPath: standardPath + filePath,
                        dstPath: tmpFolder + '/' + filename,
                        width: width,
                        height: height
                    }, function (err, stdout, stderr) {
                        if (err) res.send(err);
                        let img = fs.readFileSync(tmpFolder + '/' + filename);
                        res.writeHead(200, {'Content-Type': 'image/' + getExtension(filename)});
                        res.end(img, 'binary');
                    });
                });
            }
        }
    };
};