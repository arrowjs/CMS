'use strict';

module.exports = function (component,application) {
    return {
        "/uploads/dirtree" : {
            post : {
                handler :component.controllers.backend.dirtree,
                authenticate: true
            }
        },
        "/uploads/createdir" : {
            post : {
                handler :component.controllers.backend.createdir,
                authenticate: true
            }
        },
        "/uploads/deletedir" : {
            post : {
                handler :component.controllers.backend.deletedir,
                authenticate: true
            }
        },
        "/uploads/movedir" : {
            post : {
                handler :component.controllers.backend.movedir,
                authenticate: true
            }
        },
        "/uploads/copydir" : {
            post : {
                handler :component.controllers.backend.copydir,
                authenticate: true
            }
        },
        "/uploads/renamedir" : {
            post : {
                handler :component.controllers.backend.renamedir,
                authenticate: true
            }
        },
        "/uploads/fileslist" : {
            post : {
                handler :component.controllers.backend.fileslist,
                authenticate: true
            }
        },
        "/uploads/upload" : {
            post : {
                handler :component.controllers.backend.upload,
                authenticate: true
            }
        },
        "/uploads/download" : {
            post : {
                handler :component.controllers.backend.download,
                authenticate: true
            }
        },
        "/uploads/downloaddir" : {
            post : {
                handler :component.controllers.backend.downloaddir,
                authenticate: true
            }
        },
        "/uploads/deletefile" : {
            post : {
                handler :component.controllers.backend.deletefile,
                authenticate: true
            }
        },
        "/uploads/movefile" : {
            post : {
                handler :component.controllers.backend.movefile,
                authenticate: true
            }
        },
        "/uploads/copyfile" : {
            post : {
                handler :component.controllers.backend.copyfile,
                authenticate: true
            }
        },
        "/uploads/renamefile" : {
            post : {
                handler :component.controllers.backend.renamefile,
                authenticate: true
            }
        },
        "/uploads/thumb" : {
            get : {
                handler :component.controllers.backend.thumb,
                authenticate: true
            }
        }

    }
};

