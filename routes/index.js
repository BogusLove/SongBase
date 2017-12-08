'use strict'
var express = require('express');
var fs = require('fs');

var router = express.Router();
const base = './public/music/';
/* GET home page. */
router.get('/', function(req, res, next) {
  fs.readdir(base, (error, folders) => {
    let songs = [];
    if (error) res.render('error', {error: error});
    folders.forEach(folder => {
      fs.readdir(base + folder, (err, files) => {
        songs.push({name: folder, files: files});
      });
    });
    res.render('index', {folders: songs, helpers: {
      list: function (items) {
        if (items.length != 0){
          var out = "";
          for(var i = 0, l = items.length; i<l; i++) {
            out = out + '<option type="text" readonly value="' + items[i] + '">' + items[i] + '</option>';
          }
          return out;
        }
      }
    }
    });
  });
});

router.post('/admin_only', (req, res, next) => {
  if (req.body.password == '7373'){
    fs.readdir(base, (error, folders) => {
      let songs = [];
      if (error) res.render('error', {error: error});
      folders.forEach(folder => {
        fs.readdir(base + folder, (err, files) => {
          songs.push({name: folder, files: files});
        });
      });
      res.render('admin_only', {folders: songs, helpers: {
        list: function (items) {
          if (items.length != 0){
            var out = "";
            for(var i = 0, l = items.length; i<l; i++) {
              out = out + '<option type="text" readonly value="' + items[i] + '">' + items[i] + '</option>';
            }
            return out;
          }
        }
      }
      });
    });
  } else res.render('error', {message: 'You haven\'t access rights'});
});

router.post('/upload', function(req, res, next) {
  let dir = '';
  if (req.body.new_folder) {
    fs.existsSync(base + req.body.new_folder) ? 0 : fs.mkdirSync(base + req.body.new_folder);
    dir = req.body.new_folder + '/';
  } else {
    dir = req.body.exist_folder + '/';
  }
  const song = req.files.song;
  const fileName = req.files.song.name;
  let path = base + dir + fileName;
  song.mv(path, (err) => {
    if (err) res.render('error', {message: err.message, error: err});
    else res.redirect('/');
  });
});

router.post('/download/:folder', function (req, res, next) {
  res.download(base + req.params.folder + '/' + req.body.file);
});

module.exports = router;
