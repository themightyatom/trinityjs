
  module.exports = {
    json: function(context){
        return JSON.stringify(context);
    },
    checked:function(value){
       if (value != 0){
         return 'checked'
       }else{
         return '';
       }
    },
    radioCheck:function (value,test){
        if (value == undefined) return '';
        return value == test ? 'checked' : '';
    },
   
  }