const express = require('express');
const http = require('http');
const db = require('./db.js');

const tt = {};
// RUNS IN BACKGOUND, never returns result
tt.saveTranslations = async function (translations) {
    //check if this  is an insert or update
    console.log("INSERTING::::", translations);
    let sql = "SELECT * FROM translations WHERE item_id='" + translations.item_id + "' AND item_type='" + translations.item_type + "'";
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) { // Transaltions exist
            sql = "UPDATE translations SET ? WHERE item_id = '" + translations.item_id + "' AND item_type='" + translations.item_type + "'";
            query = db.query(sql, translations, (err, result) => {
                if (err) {
                    throw(err);
                } else {
                    return result;
                };

            });
        } else {
            sql = 'INSERT INTO translations SET ?';
            // run insert
            query = db.query(sql, translations, (err, result) => {
                if (err) {
                    throw(err);
                } else {
                    return result;
                };
            });
        }
    });

}
// RUNS IN BACKGROUND, never returns value
tt.removeTranslations = async function (translations) {
    // remove coresponding database entry
    let sql = "DELETE FROM translations WHERE item_id='" + translations.item_id + "' AND item_type='" + translations.item_type + "'";
    let query = db.query(sql, (err, result) => {
        if (err) {
            return err;
        } else {
            return result;
        };
    });
}

tt.getTranslations = async function (item, type) {
    // get all languages
    return new Promise(function (resolve, reject) {

        sql = 'SELECT * FROM languages';
        query = db.query(sql, (err, languages) => {
            if (err) throw err;
            //insert any known values
            sql = "SELECT * FROM translations WHERE item_id ='" + item.id + "' AND item_type='" + type + "'";
            query = db.query(sql, (err, translations) => {
                if (err) reject(err);
                if (translations.length > 0) {
                    for (var i = 0; i < languages.length; i++) {
                        let code = languages[i]['stub'];
                        if (translations[0][code]) languages[i].value = translations[0][code];
                    }
                }
                resolve (languages);
            });

        });

    });

}
tt.duplicateTranslations = async function (from_id,to_id,type){
    let sql = "SELECT * FROM translations WHERE item_id ='" + from_id + "' AND item_type='" + type + "'";
    let query = db.query(sql, (err, trans) =>{
        if(err) throw err;
        translations = trans[0];
        translations.item_id = to_id;
        delete translations.id;
        sql = "INSERT INTO translations SET ?";
        query = db.query(sql, translations, (err, result) => {
            if (err) {
                throw(err);
            } else {
                return result;
            };
        });
    })
   

}





module.exports = tt;