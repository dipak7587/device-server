var express = require('express');
var router = express.Router();
const {readFileSync, writeFileSync} = require('fs');
const {join} = require('path');
const uuid = require('uuid');

/* GET users listing. */
router.get('/list', function(req, res, next) {
  let data= readFileSync(join(__dirname, '../data.json'),'utf-8');
    data=JSON.parse(data);
  res.send({results:data});
});

router.post('/add', function(req, res, next) {
  const {body}= req;
  body.id= uuid.v4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
  body.date= new Date().toString()
  let data= readFileSync(join(__dirname, '../data.json'),'utf-8');
  data=JSON.parse(data);
  data.push(body)
  writeFileSync(join(__dirname, '../data.json'),JSON.stringify(data, null, '  '));
  res.send({results:body, message:'success'});
});


router.delete('/del/:id', function(req, res, next) {
  const {params:{id}}= req;
  
  let data= readFileSync(join(__dirname, '../data.json'),'utf-8');
  data=JSON.parse(data);
  data =data.filter(row=>row.id!==id)
  writeFileSync(join(__dirname, '../data.json'),JSON.stringify(data, null, '  '));
  res.send({results:id, message:'success'});
});

router.put('/edit/:id', function(req, res, next) {
  const {params:{id}, body:{...rest}}= req;
  let data= readFileSync(join(__dirname, '../data.json'),'utf-8');
  data=JSON.parse(data);
  let editedData;
 data= data.reduce((prev, next) => {
    if(next.id===id){
      editedData ={
        ...next,
        ...rest
      }
      prev.push(editedData)
    }else{
      prev.push(next);

    }
    return prev;
  },[]);
  writeFileSync(join(__dirname, '../data.json'),JSON.stringify(data, null, '  '));
  res.send({results:editedData, message:'success'});
});

module.exports = router;
