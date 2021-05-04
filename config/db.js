if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://andrei:w97.5E$.f4Btykz@movies-nodejs.v0byj.mongodb.net/movies-crud?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/movies-crud"}
}