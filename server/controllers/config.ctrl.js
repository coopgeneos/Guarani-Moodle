const I_Config = require('./../models').I_Config

module.exports = {
    updateConfig: (req, res, next) => {
      I_Config.findOne({ where: {key: req.params.key} })
        .then(config => {
          config.name = req.params.name,
          config.value = req.params.value,
          config.description = req.params.description,
          config.save()
            .then(config => {
              res.send("Config saved\n");
            })
            .catch(err => {
              res.send(err);
            })
        })
        .catch(err => {
          res.send(err);
        })
    },

    getByKey: (req, res, next) => {
      I_Config.findOne({ where: {key: req.params.key} })
        .then(config => {
          res.send(config);
        })
        .catch(err => {
          res.send(err);
        })
    },

    getAll: (req, res, next) => {
      I.Config.findAll()
        .then(configs => {
          res.send(configs);
        })
        .catch(err => {
          res.send(err);
        })
    }
}