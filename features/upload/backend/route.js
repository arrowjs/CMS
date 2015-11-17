'use strict';

module.exports = function (component,application) {
    return {
        "/uploads/dirtree" : {
            post : {
                handler :component.controllers.dirtree
            }
        },
        "/uploads/createdir" : {
            post : {
                handler :component.controllers.createdir
            }
        },
        "/uploads/deletedir" : {
            post : {
                handler :component.controllers.deletedir
            }
        },
        "/uploads/movedir" : {
            post : {
                handler :component.controllers.movedir
            }
        },
        "/uploads/copydir" : {
            post : {
                handler :component.controllers.copydir
            }
        },
        "/uploads/renamedir" : {
            post : {
                handler :component.controllers.renamedir
            }
        },
        "/uploads/fileslist" : {
            post : {
                handler :component.controllers.fileslist
            }
        },
        "/uploads/upload" : {
            post : {
                handler :component.controllers.upload
            }
        },
        "/uploads/download" : {
            post : {
                handler :component.controllers.download
            }
        },
        "/uploads/downloaddir" : {
            post : {
                handler :component.controllers.downloaddir
            }
        },
        "/uploads/deletefile" : {
            post : {
                handler :component.controllers.deletefile
            }
        },
        "/uploads/movefile" : {
            post : {
                handler :component.controllers.movefile
            }
        },
        "/uploads/copyfile" : {
            post : {
                handler :component.controllers.copyfile
            }
        },
        "/uploads/renamefile" : {
            post : {
                handler :component.controllers.renamefile
            }
        },
        "/uploads/thumb" : {
            post : {
                handler :component.controllers.thumb
            }
        }

    }
};

