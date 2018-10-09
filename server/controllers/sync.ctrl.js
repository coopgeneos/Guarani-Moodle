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
  },
  
  updateSync: (req, res, next) => {
    let syncToUpdate = req.body;
    I_Sync.findById(req.params.id)
      .then(sync => {
        sync.siu_actividad_codigo = syncToUpdate.siu_actividad_codigo ? syncToUpdate.siu_actividad_codigo : sync.siu_actividad_codigo;
        sync.siu_periodo_lectivo = syncToUpdate.siu_periodo_lectivo ? syncToUpdate.siu_periodo_lectivo : sync.siu_periodo_lectivo;
        sync.mdl_category_id = syncToUpdate.mdl_category_id ? syncToUpdate.mdl_category_id : sync.mdl_category_id;
        sync.sync_type = syncToUpdate.sync_type ? syncToUpdate.sync_type : sync.sync_type;
        sync.status = syncToUpdate.status ? syncToUpdate.status : sync.status;
        sync.save()
          .then(updated => {
            let obj = {success: true, data: updated};
            res.send(obj);
          })
          .catch(err => {
            let obj = {success: false, msg: "Hubo un error al actualizar la sincronización"};
            res.send(obj);
          })
      })
      .catch(err => {
        let obj = {success: true, msg: "No existe la sincronización que desea actualizar"};
        res.send(obj);
      })
  },
  
  getById: (req, res, next) => {
    I_Sync.findById(req.params.id)
      .then(user => {
        let obj = {success:true, data: user};
        res.send(obj);
      })
      .catch(err => {
        let obj = {success:false, msg: "El usuario solicitado no existe"};
        res.send(obj);
      })
  },

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