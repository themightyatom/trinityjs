const express = require('express');
const router = express.Router();
const fs = require("fs");
const fastcsv = require("fast-csv");
const multer = require("multer");


const db = require('../utils/db.js');
const pp = require('../utils/passport.js');
//const pp = require('../utils/controller.js');

const tmpfolder = 'public/tmp/';

const csvFilter = (req, file, cb) => {
    if (file.originalname.substr(file.originalname.lastIndexOf('.'))  == ".csv") {
      cb(null, true);
    } else {
      cb("Please upload only csv file.", false);
    }
  };
  
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, tmpfolder);
    },
    filename: (req, file, cb) => {
      
      cb(null, file.originalname);
    },
  });
  
  var upload = multer({ storage: storage, fileFilter: csvFilter });



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


router.get('/category/:id', checkAuthenticated, (req, res) => {
    let user = req.user
        .then((response) => {
            let searchstr = '\"' + req.params.id + '\"'; //search array as string
            // let sql = "SELECT * FROM models WHERE categories LIKE '%" + searchstr + "%' ORDER BY `models`.`priority` ASC";
            let sql = "SELECT mods.id as id, mods.sku as sku, merch.configurable as configurable, merch.webshop_id as webshop_id FROM models AS mods LEFT JOIN " + response.merchant_id + " AS merch ON merch.model_id = mods.sku WHERE categories LIKE '%" + searchstr + "%' ORDER BY mods.priority ASC";
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                sql = 'SELECT * FROM categories';
                query = db.query(sql, (err, cats) => {
                    if (err) throw err;
                    res.render('merchantModelList', { layout: 'merchant.hbs', models: result, categories: cats, title: 'Models' });
                })
            })
        })
});
router.post('/search', checkAuthenticated, (req, res) => {
    let user = req.user
        .then((response) => {
            // let sql = "SELECT * FROM models WHERE title LIKE '%" + req.body.term + "%' OR sku LIKE '%" + req.body.term + "%' ORDER BY `models`.`priority` ASC";
            let sql = "SELECT mods.id as id, mods.sku as sku, merch.configurable as configurable, merch.webshop_id as webshop_id FROM models AS mods LEFT JOIN " + response.merchant_id + " AS merch ON merch.model_id = mods.sku WHERE mods.title LIKE '%" + req.body.term + "%' OR mods.sku LIKE '%" + req.body.term + "%'ORDER BY mods.priority ASC";
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                sql = 'SELECT * FROM categories';
                query = db.query(sql, (err, cats) => {
                    if (err) throw err;
                    res.render('merchantModelList', { layout: 'merchant.hbs', models: result, categories: cats, title: 'Models' });
                });
            });
        })
});





router.get('/webshop-ids', checkAuthenticated, (req, res) => {


    let user = req.user
        .then((response) => {
            let sql = 'SELECT mods.id as id, mods.sku as sku, merch.configurable as configurable, merch.webshop_id as webshop_id FROM models AS mods LEFT JOIN ' + response.merchant_id + ' AS merch ON merch.model_id = mods.sku ORDER BY mods.priority ASC';

            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                sql = 'SELECT * FROM categories';
                query = db.query(sql, (err, cats) => {
                    if (err) throw err;
                    res.render('merchantModelList', { layout: 'merchant.hbs', models: result, categories: cats, title: 'Models' });
                })

            })
        })
});

router.post('/save-id', checkAuthenticated, (req, res) => {
    let user = req.user
        .then((response) => {
            let post = { model_id: req.body.sku, webshop_id: req.body.webshop_id };
            let sql = "SELECT 1 FROM " + response.merchant_id + " WHERE model_id = '" + req.body.sku + "'";
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                // update translations
                if (result.length == 0) {
                    sql = "INSERT INTO " + response.merchant_id + " SET ?";
                    query = db.query(sql, post, (err, result) => {
                        if (err) throw err;
                        res.send("ok");
                    })
                } else {
                   
                    sql = "UPDATE " + response.merchant_id + " SET webshop_id ='" + req.body.webshop_id + "' WHERE model_id = '" + req.body.sku + "'";
                    query = db.query(sql, post, (err, result) => {
                        if (err) throw err;
                        res.send("ok");
                    })
                }
            });


        });
})

router.post('/import-ids', checkAuthenticated, upload.single('file-to-upload'), (req, res) => {
    let user = req.user
        .then((response) => {
            let table = response.merchant_id;
            let filepath = tmpfolder + req.file.originalname; 
            let stream = fs.createReadStream(filepath);
            let csvData = [];
            let csvStream = fastcsv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // remove the first line: header
            csvData.shift();
            let query = "REPLACE INTO " + table +" (model_id, webshop_id) VALUES ?";

          //let query = "INSERT INTO " + table +" (model_id, webshop_id) VALUES (model_id, webshop_id) ON DUPLICATE KEY UPDATE webshop_id=VALUES(webshop_id)";



            db.query(query, [csvData], (error, response) => {
                console.log(error || response);
                res.redirect('/merchant/webshop-ids');
            });
        });

        stream.pipe(csvStream);
        })
})


router.get('/importer', checkAuthenticated, (req,res) =>{
    res.render('merchantupload.hbs', {layout:'merchant', title:"CSV upload"});
})

router.post('/setconfigurable', checkAuthenticated, (req,res) =>{
    let user = req.user
    .then((response) => {
        let table = response.merchant_id;
        let sql = "UPDATE " + table + " SET configurable = '" + req.body.configurable + "' WHERE model_id = '" + req.body.sku + "'";
        console.log("CHANGE", sql);
        db.query(sql, (err,response) =>{
            if(err) throw err;
            res.send('ok');
        })
    })
})



// PUBLIC INTERFACE

router.get('/checkproduct/:id', (req, res) => {
    let fullid = req.params.id;
    let split = fullid.indexOf('-');
    let modelid;
    let sql;
    let merchant_id = null;
    //specific merchant
    if (split) {
        modelid = fullid.substr(split + 1);
        merchant_id = fullid.substr(0, split);
        sql = "SELECT model_id FROM " + merchant_id + " WHERE  webshop_id = '" + modelid + "' AND configurable = '1'";
        let query = db.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                //check that we have it...
                sql = "SELECT id FROM models WHERE sku = '" + result[0].model_id + "'";
                query = db.query(sql, (err, result2) => {
                if(result2.length > 0){
                    res.json({ exists: true, id: result2[0].id });
                }else{
                    res.json({ exists: false }); 
                }
            });
            } else {
                res.json({ exists: false });
            }
        })

    } else {
        res.json({ exists: false });
    }

});
router.post('/getwebshopids',upload.none(), (req,res) =>{
    let strArray = "'" + req.body.list + "'";
    let commaArray = strArray.replace(/,/g, "\',\'");
    let sql = "SELECT model_id, webshop_id FROM " + req.body.merchant + " WHERE model_id IN (" + commaArray + ")";
    //let sql = "SELECT model_id, webshop_id FROM " + req.body.merchant + " WHERE model_id IN (\'4625-10\')";
    let query = db.query(sql, (err, result) =>{
        if (err) throw err;
       
        res.json({msg:'ok ' + req.body.merchant, result:result});    
    })
   
});
/*
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

router.post('/reorder', (req,res) =>{
    let list = req.body.list;
    console.log("incoming", list);
    let ind = 0;
        
          for(var i=0;i<list.length;i++) {
            var _id = list[i];
            var sql = "UPDATE models SET priority = ? WHERE id = ?";
            db.query(sql, [i, _id], function(err, result) {
              if(err) { console.log(err); return; }
            });
          };
  

    res.send('ok');


});
*/



module.exports = router;