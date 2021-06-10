const { response } = require('express');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');
const translationTools = require('../utils/translationTools');
const multer = require("multer");

var upload = multer();

router.get('/preview/:sku', (req,res) =>{
    res.render('designer',{ layout: 'design.hbs', title: 'Designer', sku:req.params.sku });
});

router.get('/previewpara', (req,res) =>{
    res.render('parametric',{ layout: 'design.hbs', title: 'Designer', sku:req.params.sku });
});

router.get('/designer/:id', (req, res) => {
    //get the model
    let fullid = req.params.id;
    let split = fullid.indexOf('-');
    let modelid;
    let sql;
    let merchant_id = null;
    //specific merchant
    if(split > 0) {
        modelid = fullid.substr(split + 1);
        merchant_id = fullid.substr(0,split);
        sql = "SELECT mods.*, merch.webshop_id as webshop_id FROM models AS mods LEFT JOIN " + merchant_id + " AS merch ON merch.model_id = mods.id WHERE merch.webshop_id = '" + modelid + "'";

    }else{
        modelid = fullid;
        sql = "SELECT * FROM models WHERE id='" + modelid + "'";
    }
    
    let query = db.query(sql, async (err, result) => {
        if (err) throw err;
        let params = result[0];
        //get the accessory groups, reformulate array for SQL
        let groups = [];
        let defaccs = [];
        let accessories = {};
        let defaultAccessories;
        
        if (params.accessory_groups.length > 0) {
            groups = JSON.parse(params.accessory_groups);
            await getAccessories(groups)
                .then((response) => {
                   // res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:response, params:params });
                 accessories = response;
                });
        }
        let materials = {title:"Choose Wood finish"};
        if (params.materials.length > 0) {
           let mats = JSON.parse(params.materials);
            await getMaterials(mats)
                .then((response) => {
                   materials.list = response;
                });
        }
        if (params.default_accessories.length > 0) {
            defaccs = JSON.parse(params.default_accessories);
            await getModels(defaccs)
                .then((response) => {
                   // res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:response, params:params });
                   defaultAccessories = response;
                   
                });
        }
        console.log("ORDERED ACCESSORIES", defaultAccessories );
    
        res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:accessories, materials:materials, defaultAccesories:defaultAccessories, params:params });


        

    });
});

router.get('/:sku', (req, res) => {
    //get the model
    
    let modelid = req.params.sku;
    
    sql = "SELECT * FROM models WHERE sku ='" + modelid + "'";
    
    
    let query = db.query(sql, async (err, result) => {
        if (err) throw err;
        let params = result[0];
        //get the accessory groups, reformulate array for SQL
        let groups = [];
        let defaccs = [];
        let accessories = {};
        let defaultAccessories;
        
        if (params.accessory_groups.length > 0) {
            groups = JSON.parse(params.accessory_groups);
            await getAccessories(groups)
                .then((response) => {
                   // res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:response, params:params });
                 accessories = response;
                });
        }
        let materials = {title:"Choose Wood finish"};
        if (params.materials.length > 0) {
           let mats = JSON.parse(params.materials);
            await getMaterials(mats)
                .then((response) => {
                   materials.list = response;
                });
        }
        if (params.default_accessories.length > 0) {
            defaccs = JSON.parse(params.default_accessories);
            await getModels(defaccs)
                .then((response) => {
                   // res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:response, params:params });
                   defaultAccessories = response;
                   
                });
        }

        res.json({accessories:accessories, materials:materials, defaultAccessories:defaultAccessories, params:params });
   
    });
});


async function getAccessories(groups) {
    return new Promise(function (resolve, reject) {
        sql = "SELECT * from accessories WHERE id IN(" + groups + ") ORDER BY `accessories`.`priority` ASC";
        query = db.query(sql, async (err, accessories) => {
            if (err) throw err;
            // replace model id's with their full properties
            for (var g = 0; g < accessories.length; g++) {
                if (accessories[g].list != null && accessories[g].list.length > 0) {
                    let models = JSON.parse(accessories[g].list);
                    await getModels(models)
                        .then((response) => {
                            accessories[g].list = response;
                        });
                }
                console.log("doing next");
            }
            resolve(accessories);
        });
    });

}

async function getModels(models) {
    return new Promise(function (resolve, reject) {
        sql = "SELECT * FROM models WHERE id IN(" + models + ") ORDER BY `models`.`priority` ASC";
        query = db.query(sql, (err, result) => {
            if (err) throw err;
            resolve(result);

        });
    });
}
async function getMaterials(materials) {
    return new Promise(function (resolve, reject) {
        sql = "SELECT * FROM standard_mat WHERE id IN(" + materials + ")";
        query = db.query(sql, (err, result) => {
            if (err) throw err;
            console.log("looking");
            resolve(result);

        });
    });
}

router.get('/accessory-group/:id', (req,res) =>{
    let _id = ['\'' + req.params.id + '\''];
    let accessories = {};
    getAccessories(_id)
    .then(response =>{
        console.log("RESP", response);
       
        res.json({accessories:response});
    })
});

router.post('/accessories', upload.none(), (req,res) =>{
    console.log("SKU", req.body.list);
    let strArray = "'" + req.body.list + "'";
    let commaArray = strArray.replace(/,/g, "\',\'");
    let sql = "SELECT accessory_groups FROM models WHERE sku IN (" + commaArray + ")";

    console.log("sql", sql);
    let query = db.query(sql, (err, result) =>{
        if (err) throw err;
        let completeList = [];
        
        result.forEach(function(arr){
       
            if(arr.accessory_groups.length){
            var a = JSON.parse(arr.accessory_groups);
                if(Array.isArray(a)){
                a.forEach(function(acc){
                    if(!completeList.includes(acc)){
                        completeList.push(acc);
                    }
                });
            }else{
                if(!completeList.includes(a)){
                    completeList.push(a);
                }
            }
            }
            
        });
       
        res.json({msg:'ok ', result:completeList});    
    })
});

module.exports = router;