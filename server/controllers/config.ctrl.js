const I_Config = require('./../models').I_Config
const models = require('./../models')

module.exports = {
  updateConfig: (req, res, next) => {
    I_Config.findOne({ where: {key: req.params.key} })
      .then(config => {
        config.name = req.params.name,
        config.value = req.params.value,
        config.description = req.params.description,
        config.save()
          .then(config => {
            let obj = {success: true, msg: "Configuración actualizada correctamente"};
            res.send(obj);
          })
          .catch(err => {
            let obj = {success: false, msg: "Hubo un error al actualizar la configuración"};
            res.send(obj);
          })
      })
      .catch(err => {
        let obj = {success: false, msg: "La configuración que desea actualizar no existe"};
        res.send(obj);
      })
  },

  updateConfigs: (req, res, next) => {
    let configsToUpdate = req.body;
    let transaction = models.sequelize.transaction()
      .then(t => {
        //try {
          for(let i = 0; i < configsToUpdate.length; i++) {
            let cfg = configsToUpdate[i];
            console.log(cfg);
            I_Config.findOne({ where: {key: cfg.key}})
              .then(config => {
                config.value = cfg.value,
                config.save({transaction: t})
                  .then(config => {
                    if(i === configsToUpdate.length -1){
                      let obj = {success: true, msg: "Configuraciónes actualizadas correctamente"};
                      res.send(obj);
                      t.commit();
                    }                   
                  })
                  .catch(err => {
                    //throw "Hubo un error al actualizar una de las configuraciones";
                    let obj = {success: false, msg: "Hubo un error al actualizar una de las configuraciones"};
                    res.send(obj);
                    t.rollback();
                  })
              })
              .catch(err => {
                //throw "La configuración que desea actualizar no existe";
                let obj = {success: false, msg: "La configuración que desea actualizar no existe"};
                res.send(obj);
                t.rollback();
              })
          }
        /*}
        catch(err) {
          let obj = {success: false, msg: err};
          res.send(obj);
          t.rollback();
        }*/  
      })
  },

  getByKey: (req, res, next) => {
    I_Config.findOne({ where: {key: req.params.key} })
      .then(config => {
        let obj = {success: true, data: config};
        res.send(obj);
      })
      .catch(err => {
        let obj = {success: false, msg: "La configuración no existe"};
        res.send(obj);
      })
  },

  getAll: (req, res, next) => {
    I_Config.findAll()
      .then(configs => {
        let obj = {success: true, data: configs};
        res.send(obj);
      })
      .catch(err => {
        let obj = {success: false, msg: "Hubo un error que imposibilitó extraer las configuraciones"};
        res.send(obj);
      })
  }
}