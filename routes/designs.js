const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../utils/db.js');
const { nanoid } = require('nanoid');
const _table = "designs";
const translationTools = require('../utils/translationTools');







router.post('/save', authenticateToken, (req, res) => {
    let params = req.params; //get user info
    //check if design of this TITLE exists
    let sql = "SELECT id FROM "+ _table +" WHERE title = '" + req.body.title + "' AND user_id = '" + req.params.id +"'";
    let query = db.query(sql, (err,result) =>{
        if (err) throw err;
        let title = req.body.title;
            let design = req.body.design;
            let user_id = req.params.id;
            let today = new Date();
            let day = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let time = today.getHours() + ":" + today.getMinutes();
            let date = day+' '+time;
            //let design = JSON.stringify(req.body.design);
            
        if(result.length < 1){
            //save it
            let id = nanoid();
            let post = { id,title,design,user_id,date};
            let sql = 'INSERT INTO ' + _table + ' SET ?';
            let query = db.query(sql, post, (err, result) => {
                if (err){
                    res.send({message:"Something went wrong", status:0});
                    throw err;
                
                } else{
                    res.send({message:"Design saved", status:1});
                }
            });
        }else{
            if(req.body.replace == 1){
                let sql = "UPDATE " + _table + " SET ? WHERE title = '" + req.body.title + "'"; 
                //keep existing id, for already shared designs
                let post = {title,design,user_id,date};
                db.query(sql, post, (err,result) =>{
                    if (err){
                        res.send({message:"Something went wrong", status:0});
                        throw err;
                    
                    } else{
                        res.send({message:"Design saved", status:1});
                    }
                })

            }else{
                res.send({message:"Design exists, overwrite?", status:2});
            }
            
        }
    })
    // remove coresponding database entry
   /* let sql = "DELETE FROM " + _table + " WHERE id = '" + req.body.id + "'";
    //remove any associated translation
    let translations = {item_id:req.body.id, item_type:'accessories'};
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        translationTools.removeTranslations(translations)
            .then(res.redirect('/accessories'));
    }); */

});

router.get('/load/:id', (req,res)=>{
  let sql = "SELECT * FROM " + _table + " WHERE id = '" + req.params.id + "'";
  db.query(sql,(err,result) =>{
      if(err) throw err;
      
      let design = result[0].design;
      res.send({message:"design retrieved", design:design});
  })
 
})
router.get('/shared/:id', (req,res)=>{
    let sql = "SELECT * FROM shares WHERE id = '" + req.params.id + "'";

    db.query(sql,(err,result) =>{
        if(err) throw err;
        let design = result[0].design;
        res.send({message:"design retrieved", design:design});
    })
   
  })

router.post('/list', authenticateToken, (req,res)=>{
    // id comes from authentication
    let sql = "SELECT id, title, date FROM " + _table + " WHERE user_id = '" + req.params.id + "'";
    db.query(sql,(err,result) =>{
        if(err) throw err;
        let designs = [];
        result.forEach(element => {
            designs.push(element);
        });
        res.send({message:"design list", designs:designs});
    }) 
  })

router.get('/all', checkAuthenticated,(req,res) =>{
    // id comes from authentication
    let sql = "SELECT id, title, date FROM " + _table ;
    db.query(sql,(err,result) =>{
        if(err) throw err;
        let designs = [];
        result.forEach(element => {
            designs.push(element);
        });
        res.render('designList', {designs:designs});
    }) 

})

function authenticateToken(req,res,next)  {
    const token = req.body.token;
    if(token == null || token == '') return res.send({message:"No token", status:0});
    jwt.verify(token, process.env.JWT_SECRET, (err,params) =>{
        if(err){
            console.log(err);
            return res.sendStatus(403);
        } 
        req.params = params;
        next();
    })
    
}
router.get('/view/:id', (req,res) =>{
        res.render('viewDesign', {layout:'design', designid:req.params.id});
});

router.get('/share/:id', (req,res) =>{
    res.render('viewShared', {layout:'design', designid:req.params.id});
});

router.post('/share', (req, res) => {
    let params = req.params; //get user info
    
    let today = new Date();
            let day = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let time = today.getHours() + ":" + today.getMinutes();
            let date = day+' '+time;
            //save it
            let design = req.body.design;
            let id = nanoid();
            let post = { id,design,date};
            let sql = 'INSERT INTO shares SET ?';
            let query = db.query(sql, post, (err, result) => {
                if (err){
                    res.send({message:"Something went wrong", status:0});
                    throw err;
                
                } else{
                    res.send({message:"Design saved", status:1, id:id});
                }
            });
       
    })




module.exports = router;