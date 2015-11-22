'use strict';

module.exports = function (component,application) {
    return {
        "/uploads/dirtree" : {
            post : {
                handler :component.controllers.backend.dirtree
            }
        },
        "/uploads/createdir" : {
            post : {
                handler :component.controllers.backend.createdir
            }
        },
        "/uploads/deletedir" : {
            post : {
                handler :component.controllers.backend.deletedir
            }
        },
        "/uploads/movedir" : {
            post : {
                handler :component.controllers.backend.movedir
            }
        },
        "/uploads/copydir" : {
            post : {
                handler :component.controllers.backend.copydir
            }
        },
        "/uploads/renamedir" : {
            post : {
                handler :component.controllers.backend.renamedir
            }
        },
        "/uploads/fileslist" : {
            post : {
                handler :component.controllers.backend.fileslist
            }
        },
        "/uploads/upload" : {
            post : {
                handler :component.controllers.backend.upload
            }
        },
        "/uploads/download" : {
            post : {
                handler :component.controllers.backend.download
            }
        },
        "/uploads/downloaddir" : {
            post : {
                handler :component.controllers.backend.downloaddir
            }
        },
        "/uploads/deletefile" : {
            post : {
                handler :component.controllers.backend.deletefile
            }
        },
        "/uploads/movefile" : {
            post : {
                handler :component.controllers.backend.movefile
            }
        },
        "/uploads/copyfile" : {
            post : {
                handler :component.controllers.backend.copyfile
            }
        },
        "/uploads/renamefile" : {
            post : {
                handler :component.controllers.backend.renamefile
            }
        },
        "/uploads/thumb" : {
            get : {
                handler :component.controllers.backend.thumb
            }
        }

    }
};

