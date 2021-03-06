const db = require("../models");
const axios = require("axios");
const chalk = require("chalk")

// Defining methods for the booksController
module.exports = {


  // When saving a streamer/game the following object needs sent
  // {
  //   "id": req.body.streamerID,
  //   "name": req.body.streamerName,
  //   "image": req.body.streamerImage,
  //   username: req.body.username
  // }
  saveStreamer: function(req, res) {

    db.User.findOne({ _id: req.session.passport.user, streamers: { $elemMatch: {id: req.body.id} }}).then(function(data){
      if(!data){
        db.User
        .updateOne({ _id: req.session.passport.user}, 
        {$push: 
          {"streamers": 
            { 
              id: req.body.id,
              name: req.body.name,
              image: req.body.image
            }
          }
        })
        .then(dbModel => {

          console.log(chalk.green("streamer saved"));
          
    
          res.json({message: "streamer saved"})
          
        })
        .catch(err => res.status(422).json(err));
        
      } else{
        console.log(chalk.red("Streamer Already Exists"));
        res.status(422).json("Streamer Already Exists");
      }
    }).catch(function(err){
      console.log(err);
    });


  },

  saveGame: function(req, res) {

    db.User.findOne({ _id: req.session.passport.user, games: { $elemMatch: {id: req.body.id} }}).then(function(data){
      if(!data){
        db.User
        .updateOne({ _id: req.session.passport.user}, 
        {$push: 
          {"games": 
            { 
              id: req.body.id,
              name: req.body.name,
              image: req.body.image
            }
          }
        })
        .then(dbModel => {
          console.log(chalk.green("Game saved"));
    
          res.json({message: "Game saved"})
          
        })
        .catch(err => res.status(422).json(err));
      } else{
        console.log(chalk.red("Game Already Exists"));
        res.status(422).json("Game Already Exists");
      }
    }).catch(function(err){
      console.log(err);
    });
  },
    
  userSavedInfo: function(req, res) {

    if (req.session.passport){
      db.User
      .findOne({ _id: req.session.passport.user})
      .then(dbModel => {
        let resObj = {
          streamers: dbModel.streamers,
          games: dbModel.games,
          username: dbModel.username,
          userImage: dbModel.userImage
        }
  
        res.json(resObj);
      })
      .catch(err => res.status(422).json(err));
    } else {
      res.status(422).json("user is not authenticated");
    }
  },

  viewClips:  function(req, res) {

    if (req.params.type === "streamer"){
      let streamerID = req.params.id;
      let x_query_clips = "https://api.twitch.tv/helix/clips?broadcaster_id=" + (streamerID);

      axios.get((x_query_clips), {
          headers: {
              'Client-ID': process.env.TWITCH_API_KEY
          }
      }).then(function (response) {
        // console.log(response.data.data);

        let resObject = {
          clips: response.data.data,
        }

        // console.log(chalk.bgRed("~~~~~~~~ resObject Start ~~~~~~~~"));
        // console.log(resObject);
        // console.log(chalk.bgRed("~~~~~~~~ resObject End ~~~~~~~~"));

        res.json(resObject)
      }).catch(function (err) {
          console.log(err);
      });
    } else if (req.params.type === "game"){
      let gameID = req.params.id;
      let x_query_game = "https://api.twitch.tv/helix/clips?game_id=" + (gameID);

      axios.get((x_query_game), {
          headers: {
              'Client-ID': process.env.TWITCH_API_KEY
          }
      }).then(function (response) {
        // console.log(response.data.data);

        let resObject = {
          clips: response.data.data,
        }

        // console.log(chalk.bgRed("~~~~~~~~ resObject Start ~~~~~~~~"));
        // console.log(resObject);
        // console.log(chalk.bgRed("~~~~~~~~ resObject End ~~~~~~~~"));

        res.json(resObject)
      }).catch(function (err) {
          console.log(err);
      });
    }
  },

  saveClip:  function(req, res) {

    if(req.body.type === "streamer"){
      db.User.findOne({ _id: req.session.passport.user, streamers: { $elemMatch: {likedContent: req.body.clipID} } }).then(function(data){
        if(!data){
          db.User
          .updateOne({ _id: req.session.passport.user,
            streamers:
              {
                $elemMatch: {id: req.body.typeID} 
              }
          }, 
          {$push: {"streamers.$.likedContent": req.body.clipID}
          })
          .then(dbModel => {
            console.log("streamer clip saved");
      
            res.json({message: "streamer clip saved"})
            
          })
          .catch(err => res.status(422).json(err));
        } else{
          console.log(chalk.red("Clip Exists"));
          res.status(422).json("Clip Exists");
        }
      }).catch(function(err){
        console.log(err);
      });
    } else if ( req.body.type === "game" ){
      db.User.findOne({ _id: req.session.passport.user, games: { $elemMatch: {likedContent: req.body.clipID} } }).then(function(data){
        if(!data){
          db.User
          .updateOne({ _id: req.session.passport.user,
            games:
              {
                $elemMatch: {id: req.body.typeID} 
              }
          }, 
          {$push: {"games.$.likedContent": req.body.clipID}
          })
          .then(dbModel => {
            console.log("game clip saved");
      
            res.json({message: "game clip saved"})
            
          })
          .catch(err => res.status(422).json(err));
        } else{
          console.log(chalk.red("Clip Exists"));
          res.status(422).json("Clip Exists");
        }
      }).catch(function(err){
        console.log(err);
      });
    }
  },

  removeStreamerOrGame: function(req, res) {

    if(req.params.type === "streamer"){
      db.User
        .updateOne({ _id: req.session.passport.user}, 
        {$pull: 
          {"streamers": 
            { 
              id: req.params.id
            }
          }
        })
        .then(dbModel => {
          console.log(chalk.green("Streamer removed"));
    
          res.json({message: "Streamer removed"})
          
        })
        .catch(err => res.status(422).json(err));
    } else if ( req.params.type === "game" ){
      db.User
        .updateOne({ _id: req.session.passport.user}, 
        {$pull: 
          {"games": 
            { 
              id: req.params.id
            }
          }
        })
        .then(dbModel => {
          console.log(chalk.green("Game removed"));
    
          res.json({message: "Game removed"})
          
        })
        .catch(err => res.status(422).json(err));
    }


  }
  
};
