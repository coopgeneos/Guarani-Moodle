const models = require('./../models')
const I_Sync = require('./../models').I_Sync
const I_SyncDetail = require('./../models').I_SyncDetail

module.exports = {
  addSync: (req, res, next) => {
    let newSync = req.body;
    let newDetails = JSON.parse(newSync.Details);
    let _details = [];
    let transaction = models.sequelize.transaction()
      .then(t => {
        I_Sync.create(newSync, {transaction: t})
          .then(sync => {
            newDetails.forEach(detail => {
              detail.dateLastSync = new Date();
              I_SyncDetail.create(detail, {transaction: t})
                .then(detail => {
                  _details.push(detail)
                  if(_details.length === newDetails.length){
                    sync.setDetails(_details, {transaction: t})
                      .then(updatedSync => {
                        let obj = {success: true, msg: "Sincronización creada con "+_details.length+" lineas"};
                        res.send(obj);
                        return t.commit();
                      })
                      .catch(err => {
                        let obj = {success: false, msg: "Hubo un error al crear la sincronización"};
                        res.send(obj);
                        return t.rollback();
                      })              
                  }
                })
                .catch(err => {
                  let obj = {success: false, msg: "Hubo un error al crear la sincronización"};
                  res.send(obj);
                  return t.rollback();
                })
            })
          })
          .catch(err => {
            let obj = {success: false, msg: "Hubo un error al crear la sincronización"};
            res.send(obj);
            return t.rollback();
          })
    });
    
    /*
    I_Sync.create(newSync)
      .then(sync => {
        newDetails.forEach(detail => {
          I_SyncDetail.create(detail)
            .then(detail => {
              _details.push(detail)
              if(_details.length === newDetails.length){
                return sync.setDetails(_details)
                  .then(updatedSync => {
                    res.send("Sync created with "+_details.length+" lines of details\n");
                  })               
              }
            })
        })
      })
      .catch(err => {
        res.send(err);
      })
    */
  },
  /*
  updateSync: (req, res, next) => {
    
  },
  */
  getByParameters: (req, res, next) => {
    I_Sync.findAll({ where: req.query })
      .then(syncs => {
        let obj = {success: true, data: syncs};
        res.send(obj);
      })
      .catch(err => {
        let obj = {success: false, msg: "Alguno de los parámetros tiene un nombre o valor incorrecto"}
        res.send(obj);
      })
  }
}