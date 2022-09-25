const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const JSZip = require("jszip");
const { nanoid } = require('nanoid');

const db = require('../utils/db.js');
const pp = require('../utils/passport.js');
//const pp = require('../utils/controller.js');
const translationTools = require('../utils/translationTools');
const sharp = require('sharp');


const glbfolder = 'public/glb/';
const thumbfolder = 'public/thumbs/models/';
const objectfolder = 'public/tmp/';
const classfolder = 'public/classes/';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, glbfolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });



const thumbstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, thumbfolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

})

const uploadthumb = multer({
    storage: thumbstorage
});

const objectstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, objectfolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

})

const uploadobject= multer({
    storage: objectstorage
});

/*
router.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE models(id int AUTO_INCREMENT, title VARCHAR(255), sku VARCHAR(255), PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log();
        res.send('Posts table created');
    })

});
*/


router.get('/all', (req, res) => {
    let sql = 'SELECT * FROM models';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});



router.get('/search/:term', (req, res) => {
    //let sql = 'SELECT * FROM models WHERE title LIKE ' + req.params.term;
    let sql = "SELECT title, id, menu, snap_type FROM models WHERE title LIKE '%" + req.params.term + "%' OR sku LIKE '%" + req.params.term + "%' ORDER BY `models`.`priority` ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;

        res.send({ models: result });
    })
});


router.get('/', checkAuthenticated, (req, res) => {
    let sql = 'SELECT * FROM models ORDER BY `models`.`priority` ASC';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        sql = 'SELECT * FROM categories';
        query = db.query(sql, (err, cats) => {
            if (err) throw err;
            res.render('modelList', { models: result, categories: cats, title: 'Models' });
        })

    })
});
router.get('/page/:page', checkAuthenticated, (req, res) => {
    let page = req.params.page;
    let prev = Number(page) - 1;
    prev = Math.max(prev, 0);
    let start = page * 25;
    let sql = 'SELECT * FROM models ORDER BY `models`.`priority` ASC LIMIT ' + start + ', 25';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            sql = 'SELECT * FROM categories';
            query = db.query(sql, (err, cats) => {
                if (err) throw err;
                res.render('modelList', { models: result, categories: cats, title: 'Models', prevpage: prev, nextpage: Number(page) + 1 });
            })
        } else {
            if (page > 0) {
                res.redirect('/models/page/0');
            } else {
                res.render('nomodels', { title: 'No models found' });
            }
        }

    })
});
router.get('/category/:id', checkAuthenticated, (req, res) => {
    let searchstr = '\"' + req.params.id + '\"'; //search array as string
    let sql = "SELECT * FROM models WHERE categories LIKE '%" + searchstr + "%' ORDER BY `models`.`priority` ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        sql = 'SELECT * FROM categories';
        query = db.query(sql, (err, cats) => {
            if (err) throw err;
            res.render('modelListResult', { models: result, categories: cats, title: 'Models' });
        })
    })
});
router.post('/search/', checkAuthenticated, (req, res) => {
    let sql = "SELECT * FROM models WHERE title LIKE '%" + req.body.term + "%' OR sku LIKE '%" + req.body.term + "%' OR model LIKE '%" + req.body.term + "%' ORDER BY `models`.`priority` ASC";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        sql = 'SELECT * FROM categories';
        query = db.query(sql, (err, cats) => {
            if (err) throw err;
            res.render('modelListResult', { models: result, categories: cats, title: 'Models' });
        })
    })
});


router.get('/editModel/:id', checkAuthenticated, (req, res) => {
    let _id = req.params.id;
    let classList;
    //let user = req.user.then((response) => {console.log("user", response)});
    let defaultAccessories = [];
    let sql = "SELECT * from models WHERE ID ='" + _id + "'";
    let query = db.query(sql, async (err, result) => {
        if (err) throw err;
        var knownParameters = result[0];
        // parse arrays
        if (knownParameters.accessory_groups.length > 1) {
            let groups = JSON.parse(knownParameters.accessory_groups);
            knownParameters.accessory_groups = groups;
        }
        if (knownParameters.materials.length > 1) {
            let mats = JSON.parse(knownParameters.materials);
            knownParameters.materials = mats;
        }
        if (knownParameters.categories.length > 1) {
            let cats = JSON.parse(knownParameters.categories);
            knownParameters.categories = cats;
        }
        if (knownParameters.variants.length > 1) {
            let vars = JSON.parse(knownParameters.variants);
            knownParameters.variants = vars;
        }
        if (knownParameters.default_accessories.length > 1) {
            let defaccs = JSON.parse(knownParameters.default_accessories);
            knownParameters.default_accessories = defaccs;
            await getModels(defaccs)
                .then((response) => {
                    // res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:response, params:params });
                    defaultAccessories = response;

                });
        }
        await getClasses(knownParameters.model_class)
            .then((response) => {
                classList = response;
            });
        translationTools.getTranslations(knownParameters, 'models')
            .then((response) => res.render('editModel', { classList: classList, params: knownParameters, defaultAccesories: defaultAccessories, languages: response }));

    });
});

async function getModels(models) {
    return new Promise(function (resolve, reject) {
        sql = "SELECT * FROM models WHERE id IN(" + models + ") ORDER BY `models`.`priority` ASC";
        query = db.query(sql, (err, result) => {
            if (err) throw err;
            resolve(result);

        });
    });
}

async function getClasses(selectedClass) {
    return new Promise(function (resolve, reject) {
        //passsing directoryPath and callback function
        fs.readdir(classfolder, function (err, files) {
            let classArray = [];
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                let str = file.substr(0, file.lastIndexOf('.'));
                let selected = '';
                if (str == selectedClass) {
                    selected = 'selected';
                }
                classArray.push({ name: str, selected: selected });
            });
            resolve(classArray);
        });



    });

}

//Create variation with same model
router.get('/variation/:id', checkAuthenticated, (req, res) => {
    //copy parameters the original model, while creating new row
    let _id = req.params.id;
    let sql = "INSERT INTO models( title, model, sku, categories, snap, snap_type, exclude, accessory_groups, materials, default_material, default_material_key, default_accessories, metadata ) SELECT title, model, sku, categories, snap, snap_type, exclude, accessory_groups, materials, default_material, default_material_key, default_accessories, metadata FROM models WHERE id=" + _id;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        translationTools.duplicateTranslations(_id, result.insertId, 'models')
            .then((response) => {
                //change name
                let newid = result.insertId;
                sql = "UPDATE models SET title = CONCAT(title, ' (copy)') WHERE id =" + newid;
                query = db.query(sql, (err, result) => {
                    if (err) throw err;
                    res.redirect('/models/editmodel/' + newid);
                });


            });
    });

});




router.get('/uploadModel', checkAuthenticated, (req, res) => {
    res.render('itemupload', { title: 'UPLOAD NEW MODEL' });
});

router.get('/uploadObject', checkAuthenticated, (req, res) => {
    res.render('objectupload', { title: 'UPLOAD NEW OBJECT' });
});

// It's very crucial that the file name matches the name attribute in your html
router.post('/uploadglb/', checkAuthenticated, upload.single('file-to-upload'), (req, res) => {
    //Check extension
    let model = req.file.originalname;
    let classList;
    // Check for database entry with same file name
    let sql = "SELECT * from models WHERE model ='" + model + "'";
    let query = db.query(sql, async (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            let id = result[0].id;

            res.redirect('/models/editModel/' + id);
        } else {
            // Otherwise create new entry
            let len = model.lastIndexOf('.');
            let sku = model.substr(0, len);
            let title = sku;
            let model_class = 'DecorObject';
            let menu = 1;
            let sql = 'INSERT INTO models SET ? ';
            let default_material = 1;
            let post = { title, sku, model, model_class };
            await getClasses(model_class)
                .then((response) => {
                    classList = response;
                });

            let query = db.query(sql, post, (err, result) => {
                if (err) throw err;
                let id = result.insertId;
                res.render('editModel', {
                    classList: classList,
                    params: {
                        model,
                        title,
                        sku,
                        id,
                        menu,
                        model_class,
                        default_material
                    }
                });
            });
        }

    });

});






router.get('/glbexists/:name', (req, res) => {
    let name = req.params.name;
    fs.exists(glbfolder + name, function (exists) {
        let uploadedFileName;
        if (exists) {
            uploadedFileName = "true";
        } else {
            uploadedFileName = "false";
        }
        res.send(uploadedFileName);

    });

});

router.get('/classexists/:name', (req, res) => {
    let name = req.params.name;
    fs.exists(classfolder + name, function (exists) {
        let uploadedFileName;
        if (exists) {
            uploadedFileName = "true";
        } else {
            uploadedFileName = "false";
        }
        res.send(uploadedFileName);

    });

});

router.post('/updatemodel', checkAuthenticated, (req, res) => {
    //save any translations
    let translations = Object.assign({}, req.body);
    delete translations.submit;
    delete translations.categories;
    delete translations.accessory_groups;
    delete translations.id;
    delete translations.sku;
    delete translations.snap;
    delete translations.title;
    delete translations.model;
    delete translations.snap_type;
    delete translations.materials;
    delete translations.default_material;
    delete translations.default_material_key;
    delete translations.default_accessories;
    delete translations.exclude;
    delete translations.include;
    delete translations.menu;
    delete translations.mirror;
    delete translations.model_class;
    delete translations.updatecopies;
    delete translations.variants;
    delete translations.metadata;

    translations.item_id = req.body.id;
    translations.item_type = 'models';


    let cats = JSON.stringify(req.body.categories);
    let groups = JSON.stringify(req.body.accessory_groups);
    let mats = JSON.stringify(req.body.materials);
    let defAccs = JSON.stringify(req.body.default_accessories);
    let vars = JSON.stringify(req.body.variants);
    req.body.categories = cats;
    req.body.accessory_groups = groups;
    req.body.default_accessories = defAccs;
    req.body.variants = vars;
    delete req.body.submit;
    let sql = "UPDATE models SET ? WHERE id = '" + req.body.id + "'";
    let post = { variants: vars, model_class: req.body.model_class, default_accessories: defAccs, default_material: req.body.default_material, default_material_key: req.body.default_material_key, materials: mats, categories: cats, accessory_groups: groups, model: req.body.model, snap: req.body.snap, snap_type: req.body.snap_type, exclude: req.body.exclude, include: req.body.include, sku: req.body.sku, title: req.body.title, menu: req.body.menu, mirror: req.body.mirror, metadata: req.body.metadata };

    delete post.submit;
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        // update translations
        translationTools.saveTranslations(translations)
            .then(value => {
                if (Number(req.body.updatecopies) > 0) {
                    //update other models sharing same base model
                    sql = "UPDATE models SET ? WHERE model = '" + req.body.model + "'";
                    post = { categories: cats, accessory_groups: groups, snap: req.body.snap, snap_type: req.body.snap_type, exclude: req.body.exclude };
                    query = db.query(sql, post, (err, result) => {
                        if (err) throw err;
                        res.redirect('/models')
                    }
                    );
                } else {
                    res.redirect('/models');
                }
            });
    });

})
router.post('/deletemodel', checkAuthenticated, (req, res) => {
    const path = glbfolder + req.body.model;
    const modname = req.body.model;
    // remove coresponding database entry

    let sql = "DELETE FROM models WHERE id = '" + req.body.id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
    });
    //check if model is in use in any other variations
    sql = "SELECT id,title FROM models WHERE model = '" + req.body.model + "'";
    query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            // remove the model from the server
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err)
                    return
                }

                //file removed
            })
            res.redirect('/models');
        } else {
            let variations = result;
            res.render('modelinuse', { model: modname, variations: variations });
        }

    });


});



// PUBLIC INTERFACE

router.get('/:id', (req, res) => {
    let _id = req.params.id;
    let sql = "SELECT * from models WHERE ID ='" + _id + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.send({ message: 'No model found with that id' });
        }
    })
});

router.post('/thumb', async function (req, res) {
    var base64Data = req.body.imgBase64.replace(/^data:image\/png;base64,/, "");
    var id = req.body.id;
    var sku = req.body.sku;
    var img = Buffer.from(base64Data, 'base64');
    await sharp(img)
        .resize({ width: 80, height: 80 })
        .toFile(thumbfolder + id + '.png')
    res.send('done');
});

router.post('/uploadthumb/', uploadthumb.single('file-to-upload'), (req, res) => {
    let modelid = req.body.modelid + '.png';
    let thumb = req.file;
    var file = path.join(thumbfolder, req.file.originalname);
    var updated = path.join(thumbfolder, modelid);
    fs.rename(file, updated, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("back")
        }

    })
});

router.post('/reorder', (req, res) => {
    let list = req.body.list;


    for (var i = 0; i < list.length; i++) {
        var _id = list[i];
        var sql = "UPDATE models SET priority = ? WHERE sku = ?";
        db.query(sql, [i, _id], function (err, result) {
            if (err) { console.log(err); return; }
        });
    };


    res.send('ok');


});

router.get('/idfromsku/:sku', (req, res) => {
    let _sku = req.params.sku;
    let sql = "SELECT id from models WHERE sku ='" + _sku + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.send({ message: 'No model found with that sku' });
        }
    })
});

// It's very crucial that the file name matches the name attribute in your html
router.post('/uploadobject/', checkAuthenticated, uploadobject.single('file-to-upload'), (req, res) => {
    const tmpFolderName = nanoid();
    const tmpFolder = objectfolder + tmpFolderName + "/";
    const tmpFilePath = objectfolder + req.file.originalname;
    fs.readFile(tmpFilePath, function (err, data) {
        if (err) {
            throw err;
        }
        console.log('[method] Before extracting file...');
        JSZip.loadAsync(data).then(function (zip) {
            var files = Object.keys(zip.files);
            console.log('[method] files to be created ' + files.length);
            // in my case, the folders where not being created while "inflating" the content. created the folders in a separated loop 
            // O(n) for those geeks on complexity. 
            createDirectories(files, tmpFolder);
            createFiles(files, zip, tmpFolder, deflateComplete, res);
        }).catch(function (err) {
            console.log(err);
        });
    });
});

async function deflateComplete(folder,res){
    console.log("DONE", folder);
    // copy files to appropriate destinations...
    const files = await getFileNames(folder);

    console.log("FILES", files);

    if(files.length < 1) return;

    let model;
    let params = {};
    let classname = 'DecorObject'; //default class

    for(var i=0;i<files.length;i++){
        let ext = files[i].split('.').pop();
        switch(ext){
            case 'glb':
                //save to glb folder
                model = files[i];
                console.log("FOLDERS", folder + model, glbfolder + model);
                fs.rename(folder + model, glbfolder + model, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - AKA moved!')
                  })
            break;
            case 'json':
                let rawdata = fs.readFileSync(folder + files[i]);
                params = JSON.parse(rawdata);
                // use as paramaters for new entry
            break;
            case 'js':
                // use as new Class for entry. Do not replace TrinityObject
                if(files[i] != "DecorObject.js"){
                    fs.rename(folder + files[i], classfolder + files[i], function (err) {
                        if (err) throw err
                        console.log('Successfully renamed - AKA moved!')
                    })
                    classname = files[i].split('.')[0];
                }
            break;
            default:
                break;
        }
    }


    let sql = "SELECT * from models WHERE model ='" + model + "'";
    let query = db.query(sql, async (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            let id = result[0].id;

            res.redirect('/models/editModel/' + id);
        } else {
            // Otherwise create new entry
            console.log("USING params", params);
            let len = model.lastIndexOf('.');
            let sku = params.sku ? params.sku : model.substr(0, len);
            let title = params.sku ? params.sku : model.substr(0, len);
            let model_class = params.model_class ? params.model_class : classname;
            let menu = params.menu ? params.menu : 1;
            let snap_type = params.snap_type ? params.snap_type : '';
            let snap = params.snap ? params.snap : '';
            let metadata = params.metadata ? params.metadata : '';
            let sql = 'INSERT INTO models SET ? ';
            let default_material = 1;
            let post = { title, sku, model, model_class };
            await getClasses(model_class)
                .then((response) => {
                    classList = response;
                });

            let query = db.query(sql, post, (err, result) => {
                if (err) throw err;
                let id = result.insertId;
                res.render('editModel', {
                    classList: classList,
                    params: {
                        model,
                        title,
                        sku,
                        id,
                        snap,
                        snap_type,
                        menu,
                        model_class,
                        default_material,
                        metadata
                    }
                });
            });
        }

    });
}
async function getFileNames(path) {
    return new Promise(function (resolve, reject) {
        //passsing directoryPath and callback function
        fs.readdir(path, function (err, files) {
            let fileArray = [];
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
                
                fileArray.push(file);
            });
            resolve(fileArray);
        });

    });

}



/**
 * Sync opperation to create the folders required for the files.
 * @param files
 */
function createDirectories(files, folder) {
    files.forEach(function (filename) {
        var dest = path.join(folder, filename);
        ensureDirectoryExistence(dest);
    });
}

/**
 * recursive create directory function
 * @param filePath
 * @returns {boolean}
 */
function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

/**
 * Create files sync or blocking
 * @param files
 * @param zip
 * @param cb
 */
function createFiles(files, zip, tmp, cb, result) {
    try {
        var countFilesCreated = 0;
        files.forEach(function (filename) {
            var dest = path.join(tmp, filename);
            // skip directories listed
            if (dest.charAt(dest.length - 1) === '/') {
                countFilesCreated++;
                return;
            }
            return zip.file(filename).async('nodebuffer').then(function(content){
                // var content = zip.files[filename].nodeStream();
                fs.writeFileSync(dest, content);
                countFilesCreated++;
                // proably someone with more experience in JS can implement a promice like solution. 
                // I thought that in here instead of the counter we coud use an indexOf to return an error in case not all the elements where created correctly. 
                // but if a file throw an error, its handled by the catch ... 
                if (countFilesCreated >= files.length) {
                    console.log('All files created!!');
                   cb(tmp, result);
                }
            });
        });
    } catch (err) {
        throw err;
    }
}

module.exports = router;