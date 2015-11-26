'use strict';

let fs = require('fs'),
    sizeOf = require('image-size'),
    im = require('imagemagick'),
    formidable = require('formidable'),
    path = require('path');

let rootPath = '/fileman/uploads';
let standardPath = __base + 'upload';
var spawn = require('child_process').spawn;

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


module.exports = function (controller, component, application) {
    controller.dirtree = function (req, res) {
        let results = [];
        getDirectories(rootPath, results);
        res.jsonp(results);
    };
    controller.createdir = function (req, res) {
        let dir = req.body.d;
        let name = req.body.n;

        fs.mkdir(standardPath + dir + '/' + name, '7777', function (err) {
            if (err) {
                throw err;
            } else {
                res.jsonp({"res": "ok", "msg": ""});
            }
        });
    };
    controller.deletedir = function (req, res) {
        let dir = req.body.d;

        fs.rmdir(standardPath + dir, function (err) {
            if (err) {
                res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_dir_error')});
            } else {
                res.jsonp({"res": "ok", "msg": ""});
            }
        });
    };
    controller.movedir = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.copydir = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };
    controller.renamedir = function (req, res) {
        let d = req.body.d;
        let n = req.body.n;
        let path = d.substring(0, d.lastIndexOf('/'));

        fs.renameSync(standardPath + d, standardPath + path + '/' + n);
        res.jsonp({"res": "ok", "msg": ""});
    };

    controller.fileslist = function (req, res) {
        let folder = req.body.d;
        let type = req.body.type;
        let rPath = standardPath + folder;

        fs.readdir(rPath, function (err, files) {
            if (!err) {
                let result = [];
                for (let i in files) {
                    let filePath = rPath + '/' + files[i];
                    if (checkFileType(filePath) == "image") {
                        let sta = fs.statSync(filePath);
                        if (sta.isFile()) {
                            let dimension = sizeOf(filePath);
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
                }
                res.jsonp(result);
            }
        });
    };

    controller.upload = function (req, res) {
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            let destination = standardPath + fields.d + '/' + files["files[]"].name;

            fs.access(destination, function (err) {
                if (!err) {
                    let ext = path.extname(destination);
                    let noExt = destination.replace(/\..*$/, '');

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
        });

        form.on('end', function () {
            res.jsonp({"res": "ok", "msg": ""});
        });
    };

    controller.download = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.downloaddir = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.deletefile = function (req, res) {
        let file = req.body.f;
        if (fs.existsSync(standardPath + file)) {
            fs.unlink(standardPath + file, function (err) {
                if (err) {
                    throw err;
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
    };
    controller.copyfile = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.movefile = function (req, res) {
        res.jsonp({"res": "error", "msg": __('m_upload_backend_controllers_index_delete_error_integrated')});
    };

    controller.renamefile = function (req, res) {
        let f = req.body.f;
        let n = req.body.n;
        let path = f.substring(0, f.lastIndexOf('/'));

        fs.renameSync(standardPath + f, standardPath + path + '/' + n);

        // Change name of thumb tmp
        let tmp = getFileName(f);
        let tmp_path = standardPath + '/fileman/tmp/' + tmp;
        if (fs.existsSync(tmp_path)) {
            fs.renameSync(tmp_path, standardPath + '/fileman/tmp/' + n);
        }
        res.jsonp({"res": "ok", "msg": ""});
    };
    controller.thumb = function (req, res) {
        let filePath = req.query.f;
        let width = req.body.width;
        let height = req.body.height;
        let tmpFolder = standardPath + '/fileman/tmp';
        let filename = getFileName(filePath);
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
    };
};


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