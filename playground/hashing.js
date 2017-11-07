const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');

var password = '123pass!';

bcrypt.genSalt(10,(err, salt)=>{
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword  ='$2a$10$TaTASj8LBQBMwJWhR07Xr.oFVWazy/3d/DLOaW5loziNJBMnCCEGS';

bcrypt.compare(password, hashedPassword,(err, res)=> {
  console.log(res);
});



//
// var data = {
//   id: 22
// };
//
// var token = jwt.sign(data, 'secrettoken');
// console.log(token);
//
// var decoded = jwt.verify(token, 'secrettoken');
// console.log('decoded',decoded);



// var message = 'I am user ABC6';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log( `Hash: ${hash}`);
//
// var data = {
//   id:  4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+' some secret').toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data)+' some secret').toString();
//
// // token.data.id = 5
// // token.hash= SHA256(JSON.stringify(token.data)).toString();
//
// if(resultHash === token.hash) {
//   console.log('data was not changed');
// } else {
//   console.log('data was changed - don\'t trust');
// }
