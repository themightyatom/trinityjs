const { response } = require('express');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../utils/db.js');
const translationTools = require('../utils/translationTools');


router.get('/designer/:id', (req, res) => {
    //get the model
    let sql = "SELECT * FROM models WHERE id='" + req.params.id + "'";
    let query = db.query(sql, async (err, result) => {
        if (err) throw err;
        let params = result[0];
        //get the accessory groups, reformulate array for SQL
        let groups = [];
        let accessories = {};
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
        res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:accessories, materials:materials, params:params });


        // params.accessory_groups = accessories;
        //  console.log("HI", accessories);
        // res.render('designer',{ layout: 'design.hbs', title: 'Designer', accessories:accessories, params:params });

    });
});


async function getAccessories(groups) {
    return new Promise(function (resolve, reject) {
        sql = "SELECT * from accessories WHERE id IN(" + groups + ")";
        query = db.query(sql, async (err, accessories) => {
            if (err) throw err;
            // replace model id's with their full properties
            for (var g = 0; g < accessories.length; g++) {
                if (accessories[g].list != null) {
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
        sql = "SELECT * FROM models WHERE id IN(" + models + ")";
        query = db.query(sql, (err, result) => {
            if (err) throw err;
            console.log("looking");
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

module.exports = router;