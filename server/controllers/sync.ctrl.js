const models = require('./../models')
const I_Sync = require('./../models').I_Sync
const I_SyncDetail = require('./../models').I_SyncDetail
const I_SyncCategory = require('./../models').I_SyncCategory
const I_SyncCohort = require('./../models').I_SyncCohort
const C_SIU_School_Period = require('./../models').C_SIU_School_Period

function getNextSync(sync) {

  if (sync.task_from && sync.task_to) {
    console.log('sync.task_from',sync.task_from);
    console.log('sync.task_to',sync.task_to)
    //Por defecto la periodicidad es 24 hs
    sync.task_periodicity = (sync.task_periodicity == null 
        || sync.task_periodicity < 0 
        || sync.task_periodicity >= 24) 
      ? 0 
      : parseInt(sync.task_periodicity);
    from = sync.task_from;
    to = sync.task_to;
    now = new Date();
    nowtime = now.getTime();
    if (from > to) 
      throw 'La configuración de sincronización automática tiene las fechas cruzadas';
    /*
      Si la sincronización debe iniciarse ni bien se crea o actualiza, debido a que el rango de fechas
      incluye al momento de la acción (creacion o actualizacion), entonces se debe calcular la siguiente
      sincronización.
    */
    if(from < nowtime && nowtime < to){
      let n = now.getHours() + sync.task_periodicity >= 24 ? now.getHours() + sync.task_periodicity - 24 : now.getHours() + sync.task_periodicity;
      return n;
    } else
      return 0;
  }
  return 0;
}

module.exports = {
  addSync: (req, res, next) => {
    let newSync = req.body;
    newSync.task_next = getNextSync(newSync);
    let newDetails = newSync.Details;
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
                        let obj = {success: false, msg: "Hubo un error al guardar la sincronización"};
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
    syncToUpdate.task_next = getNextSync(syncToUpdate);
    console.log('Update Sync',syncToUpdate)

    I_Sync.update(syncToUpdate,{where: { I_Sync_id: req.params.id }})
      .then(result => {
        console.log(result);
        if (result.length == 0){
          let obj = {success: true, msg: "No existe la sincronización que desea actualizar"};
          res.send(obj);
        }
        else {
          let obj = {success: true, data: result[0]};
          res.send(obj);
        }
      }
    )
      .catch(err => {
        console.log(err);
        let obj = {success: false, msg: "Hubo un error al actualizar la sincronización"};
        res.send(obj);
      }
    )
/*

    I_Sync.findById(req.params.id)
      .then(sync => {
        syncToUpdate.siu_actividad_codigo = syncToUpdate.siu_actividad_codigo ? syncToUpdate.siu_actividad_codigo : sync.siu_actividad_codigo;
        syncToUpdate.siu_periodo_lectivo = syncToUpdate.siu_periodo_lectivo ? syncToUpdate.siu_periodo_lectivo : sync.siu_periodo_lectivo;
        syncToUpdate.i_syncCategory_id = syncToUpdate.i_syncCategory_id ? syncToUpdate.i_syncCategory_id : sync.i_syncCategory_id;
        syncToUpdate.i_syncCohort_id = syncToUpdate.i_syncCohort_id ? syncToUpdate.i_syncCohort_id : sync.i_syncCohort_id;
        syncToUpdate.sync_type = syncToUpdate.sync_type ? syncToUpdate.sync_type : sync.sync_type;
        syncToUpdate.status = syncToUpdate.status ? syncToUpdate.status : sync.status;
        syncToUpdate.save()
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
      })*/
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
    I_Sync.findAll({where: req.query,
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    include: [{
                      model: C_SIU_School_Period, 
                      attributes: {exclude: ['createdAt', 'updatedAt']} 
                    },{
                      model: I_SyncDetail, 
                      attributes: {exclude: ['createdAt', 'updatedAt']},
                      as: 'Details' 
                    },{
                      model: I_SyncCategory, 
                      attributes: {exclude: ['createdAt', 'updatedAt']},
                    },{
                      model: I_SyncCohort, 
                      attributes: {exclude: ['createdAt', 'updatedAt']},
                    }]
                  })
      .then(syncs => {
        let obj = {success: true, data: syncs};
        res.send(obj);
      })
      .catch(err => {
        console.log(err);
        let obj = {success: false, msg: "Alguno de los parámetros tiene un nombre o valor incorrecto"}
        res.send(obj);
      })
  }
}