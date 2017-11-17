var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
   var config = require('./config.json');
   //console.log(config);
   //console.log(env);
   var envConfig = config[env];  //returns the properties by variable as an array
   //console.log(JSON.stringify(envConfig));
   //console.log(Object.keys(envConfig)); //returns the keys by variable as an array
   Object.keys(envConfig).forEach((key) => {
     process.env[key] = envConfig[key];
     // console.log(process.env[key]);     //returns the value for each key
     // console.log(key);
     // console.log(process.env.PORT);
     // console.log(process.env.MONGODB_URI);  //initially returns undefined as key not yet set.
   });
}

//replaces the one below

// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } elsif (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// };
