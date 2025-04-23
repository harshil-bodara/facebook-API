const sequalize = require("../config/db"); 

const User = require('./user/user');



const db={};
db.sequalize=sequalize
db.User=User;

(async()=>{
    try {
        await sequalize.authenticate();
        console.log('database Connected');
        await sequalize.sync({alter:true})
    } catch (error) {
        console.error('database error',error);
        
    }
})
();


module.exports=db;