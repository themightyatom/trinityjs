
const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');
const translationTools = require('../utils/translationTools');
const multer = require("multer");
const defaultLanguage = "de"; // displays database titles

var upload = multer();

router.get('/preview/:id', (req,res) =>{
    res.render('designer',{ layout: 'design.hbs', title: 'Designer', id:req.params.id });
});

router.get('/pro', (req,res) =>{
    res.render('pro',{ layout: 'design.hbs', title: 'Designer' });
});

router.get('/previewpara', (req,res) =>{
    res.render('parametric',{ layout: 'design.hbs', title: 'Designer', sku:req.params.sku });
});

router.get('/designer/:id', (req, res) => {
    //get the model
    let fullid = req.params.id;
    let idArray = fullid.split('-');
    let modelid = idArray[0];
    let sql;
    let merchant_id = null;
    let lang;
    //specific merchant
    if(idArray.length > 1) {
        merchant_id = idArray[1];
        sql = "SELECT mods.*, merch.webshop_id as webshop_id FROM models AS mods LEFT JOIN " + merchant_id + " AS merch ON merch.model_id = mods.id WHERE merch.webshop_id = '" + modelid + "'";
    }else{
        sql = "SELECT * FROM models WHERE id='" + modelid + "'";
    }
    if(idArray.length == 3){
        lang = idArray[2];
    }else{
        lang = defaultLanguage;
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
            await getAccessories(groups,lang)
                .then((response) => {
                   // res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:response, params:params });
                 accessories = response;
                });
        }
        let materials = {title:"Choose Wood finish"};
        if(lang == "da"){
            materials.title = "Vælg overflade på træet";
        }
        if(lang == "de"){
                materials.title = "Wähle Oberfläche";
        }
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
    
        res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:accessories, materials:materials, defaultAccesories:defaultAccessories, params:params });


        

    });
});

router.get('/getmodel/:lang/:sku/:id', (req, res) => {
    //get the model

    
    
    let sku = req.params.sku;
    let lang = req.params.lang;
    let id = Number(req.params.id);

    let sql;
    // id overrides SKU, which may not be unique
    if(id > 0){
        sql = "SELECT * FROM models WHERE id ='" + id + "'";
    }else{
        sql = "SELECT * FROM models WHERE sku ='" + sku + "'";
    }
    
    
    
    let query = db.query(sql, async (err, result) => {
        if (err) throw err;
        let params = result[0];
        
        if(result.length < 1){
            res.json({message:"No such model number"});
        }else{
            //get the accessory groups, reformulate array for SQL
            let groups = [];
            let defaccs = [];
            let accessories = {};
            let defaultAccessories;
            let extraAccessories = [];


            if (params.default_accessories.length > 0) {
                defaccs = JSON.parse(params.default_accessories);
                await getModels(defaccs)
                    .then((response) => {
                    // res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:response, params:params });
                    
                    response.forEach(mod =>{
                        //if the parts have their own accessories, include these also (nested accessory groups)
                        if(mod.accessory_groups){
                            extraAccessories = extraAccessories.concat( JSON.parse(mod.accessory_groups));
                        }
                    });
                    
                    defaultAccessories = response;
                    
                    });
            }
            
            // get the accessory groups for any startup accessories too
            if (params.accessory_groups.length > 0) {
                //if a string (single value), create array
                if(params.accessory_groups.substr(0,1) != "["){
                    params.accessory_groups = '[' + params.accessory_groups + ']';
                }
                groups = JSON.parse(params.accessory_groups);
                groups = groups.concat(extraAccessories);
                await getAccessories(groups,lang)
                    .then((response) => {
                    accessories = response;
                    });
            }
            //load external translations!!!
            let materials = {title:"Choose Wood finish"};
            let variants = {title:"Variations"};
            if(lang == "da"){
                materials.title = "Vælg overflade på træet";
                variants.title = "Variationer";
            }
            if(lang == "de"){
                    materials.title = "Wähle Oberfläche";
                    variants.title = "Variationen";
            }
            
            if (params.materials.length > 0) {
            let mats = JSON.parse(params.materials);
                await getMaterials(mats)
                    .then((response) => {
                    materials.list = response;
                    });
            }
            if (params.variants.length > 0) {
                let vars = JSON.parse(params.variants);
                await getVariants(vars)
                    .then((response) => {
                        variants.list = response;
                    });
            }
           

            res.json({accessories:accessories, materials:materials, defaultAccessories:defaultAccessories, variants:variants, params:params });
        }
    });
});


async function getAccessories(groups,lang = 'none') {
    return new Promise(function (resolve, reject) {
        if(lang == "none"){
            sql = "SELECT * from accessories WHERE id IN(" + groups + ") ORDER BY `accessories`.`priority` ASC";
        }else{
            sql = "SELECT acc.list as list, acc.id as id, acc.type as type, tran." + lang + " as title FROM accessories AS acc LEFT JOIN translations AS tran ON tran.item_id = acc.id AND tran.item_type = 'accessories' WHERE acc.id IN(" + groups + ") ORDER BY acc.priority ASC";   
           // "SELECT mods.*, merch.webshop_id as webshop_id FROM models AS mods LEFT JOIN " + merchant_id + " AS merch ON merch.model_id = mods.id WHERE merch.webshop_id = '" + modelid + "'";
        }
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
            resolve(result);

        });
    });
}

async function getVariants(variants) {
    return new Promise(function (resolve, reject) {
        sql = "SELECT * FROM models WHERE id IN(" + variants + ") ORDER BY `models`.`priority` ASC";
        query = db.query(sql, (err, result) => {
            if (err) throw err;
            resolve(result);

        });
    });
}
// cahnge to POST!!! Can only be one get??
router.get('/accessory-group/:lang/:id', (req,res) =>{
    let _id = ['\'' + req.params.id + '\''];
    let lang = req.params.lang;
    let accessories = {};
    if(_id != undefined){
        getAccessories(_id,lang)
        .then(response =>{ 
            res.json({accessories:response});
        })
    }else{
        res.json({message:'no accessories'});  
    }
});

router.post('/accessories', upload.none(), (req,res) =>{
   
    let strArray = "'" + req.body.list + "'";
    let commaArray = strArray.replace(/,/g, "\',\'");
    let sql = "SELECT accessory_groups FROM models WHERE id IN (" + commaArray + ")";

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

router.get('/productmenu/:lang', (req,res) =>{
    let lang = req.params.lang;
    if(lang == "none"){
        //sql = "SELECT * from categories WHERE id IN(" + groups + ") ORDER BY `accessories`.`priority` ASC";
        sql = "SELECT title,id from categories WHERE menu = '1' ORDER BY `categories`.`priority` ASC";
    }else{
       // sql = "SELECT title,id from categories WHERE menu = '1'";
    sql = "SELECT cat.id as id, tran." + lang + " as title FROM categories AS cat LEFT JOIN translations AS tran ON tran.item_id = cat.id AND tran.item_type = 'categories'  WHERE menu = '1' ORDER BY cat.priority ASC";   
       // "SELECT mods.*, merch.webshop_id as webshop_id FROM models AS mods LEFT JOIN " + merchant_id + " AS merch ON merch.model_id = mods.id WHERE merch.webshop_id = '" + modelid + "'";
    }
    let query = db.query(sql, (err,result) =>{
        if (err) throw err;
        result = result.map(v => Object.assign({}, v)); //convert mysql result to JSON

        res.json({msg:"menu", lang:req.params.lang, cats: result});

    })
});


router.get('/category/:id/:lang',(req,res) => {

    let _id = '"' + req.params.id + '"';
    let lang = req.params.lang;
    if(lang == "none"){
        //sql = "SELECT * from categories WHERE id IN(" + groups + ") ORDER BY `accessories`.`priority` ASC";
        sql = "SELECT * from models WHERE categories LIKE '%" + _id + "%' AND menu = '1' ORDER BY priority ASC" ;
    }else{
        sql = "SELECT acc.list as list, acc.id as id, acc.type as type, tran." + lang + " as title FROM accessories AS acc LEFT JOIN translations AS tran ON tran.item_id = acc.id AND tran.item_type = 'accessories' WHERE acc.id IN(" + groups + ") ORDER BY acc.priority ASC";   
       // "SELECT mods.*, merch.webshop_id as webshop_id FROM models AS mods LEFT JOIN " + merchant_id + " AS merch ON merch.model_id = mods.id WHERE merch.webshop_id = '" + modelid + "'";
    }
    let query = db.query(sql, (err,result) =>{
        if (err) throw err;
        result = result.map(v => Object.assign({}, v)); //convert mysql result to JSON

        res.json({msg:"menu", lang:req.params.lang, models: result});

    })
});

router.get('/openvr/:designid', (req,res) =>{
    res.render('vr',{ layout: 'design.hbs', title: 'VR viewer', designid:req.params.designid  });
});




module.exports = router;