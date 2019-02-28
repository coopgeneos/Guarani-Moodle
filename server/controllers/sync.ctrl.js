const models = require('./../models')
const I_Sync = require('./../models').I_Sync
const I_SyncDetail = require('./../models').I_SyncDetail
const I_SyncCategory = require('./../models').I_SyncCategory
const I_SyncCohort = require('./../models').I_SyncCohort
const I_SyncUp = require('./../models').I_SyncUp
const I_Log = require('./../models').I_Log
const C_SIU_School_Period = require('./../models').C_SIU_School_Period
const I_Config = require('./../models').I_Config


function getNextSync(sync) {

  if (sync.task_from && sync.task_to) {

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

    if (!newSync.i_syncCategory_id)
      res.send({success: false, msg: "Falta parametro obligatorio: Categoria"});

    if (!newSync.c_siu_school_period_id)
      res.send({success: false, msg: "Falta parametro obligatorio: Periodo Lectivo"});

    if (!newSync.Details || newSync.Details.length == 0)
      res.send({success: false, msg: "Debe seleccionar al menos una comisión"});

    if (!newSync.name || newSync.name.length < 8)
      res.send({success: false, msg: "El nombre de la sincronización debe contener al menos 8 caracteres"});

    if (!newSync.code || newSync.code.length < 5)
      res.send({success: false, msg: "El codigo de la sincronización debe contener al menos 5 caracteres"});

    let default_sync_periodicity;
    let default_sync_days;

    Promise.all([
      I_Config.findOne({ where: {key: 'DEFAULT_SYNC_PERIODICITY'}}).then(s => {default_sync_periodicity = s.dataValues.value}),
      I_Config.findOne({ where: {key: 'DEFAULT_SYNC_DAYS'}}).then(s => {default_sync_days = s.dataValues.value}),
    ])
    .then( (values) => {

      if (default_sync_days > 0 ){
        newSync.task_from =  new Date().getTime();
        newSync.task_to = new Date().getTime() + (1000*60*60*24*default_sync_days); 
      }

      if (default_sync_periodicity > 0){
        newSync.task_periodicity = parseInt(default_sync_periodicity);
      }

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

    })
    .catch(err => {
      let obj = {success: false, msg: 'Hubo un error al crear la sincronización.' + err};
      res.send(obj);
    })
   
  },
  
  updateSync: (req, res, next) => {
    let syncToUpdate = req.body;
    syncToUpdate.task_next = getNextSync(syncToUpdate);

    I_Sync.update(syncToUpdate,{where: { I_Sync_id: req.params.id }})
      .then(result => {
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
  },

  addAssignments: async (req, res, next) => {

    let I_Sync_id = req.params.id ;
    let newDetails = req.body;
    
    let added = 0;

    sync = await I_Sync.findOne({where: {I_Sync_id: req.params.id}})

    let transaction = models.sequelize.transaction()
    .then(t => {

      //Check if alredy exist
      I_SyncDetail.findAll({where:{i_sync_id:I_Sync_id}})
      .then(async (details) => {

        for(let i = 0 ; i < newDetails.length ; i++) {

          let found = false;

          for (let j = 0 ; j < details ; j++) {

            if (details[j].dataValues.siu_assignment_code == newDetails[i].siu_assignment_code){
              found = true;
            }
          }

          //Add new 
          if (!found) {
            let newDetail = newDetails[i];
            newDetail.dateLastSync = new Date();
            newDetail.i_sync_id = I_Sync_id;
            detail = await I_SyncDetail.create(newDetail,{transaction: t});
            if (detail)
              added++;
          }

        }
        let obj = {success: true, msg: "Se agregaron "+added+" comisiones a la sincronización: "+sync.name};
        res.send(obj);
        t.commit();
      })
      .catch(err => {
        console.log(err);
        let obj = {success: false, msg: "Hubo un error al agregar las comisiones: "+err};
        res.send(obj);
        t.rollback();
      })
    });
  },

  deleteAssignment: async (req, res, next) => {

    let I_SyncDetail_id = req.params.id ;
    
    I_SyncDetail.destroy({where:{I_SyncDetail_id:I_SyncDetail_id}})
    .then((rows) => {
      let obj = {success: true, msg: "Se elimino la comision correctamente"};
      res.send(obj);
    })
    .catch(err => {
      console.log(err);
      let obj = {success: false, msg: "Se produjo un error al eliminar la comisión: "+err};
      res.send(obj);
    })
  },
  
  getById: (req, res, next) => {
    I_Sync.findById(req.params.id)
      .then(sync => {
        let obj = {success:true, data: sync};
        res.send(obj);
      })
      .catch(err => {
        let obj = {success:false, msg: "La sincronización solicitada no existe"};
        res.send(obj);
      })
  },

  getByParameters: (req, res, next) => {
    I_Sync.findAll({where: req.query,
                    attributes: {exclude: ['createdAt', 'updatedAt']},
                    order: [
                        ["name","asc"],
                        [{ model: I_SyncDetail, as: 'Details' },"siu_assignment_code","asc"],
                      ], 
                    include: [{
                      model: C_SIU_School_Period, 
                      attributes: {exclude: ['createdAt', 'updatedAt']},
                    },{
                      model: I_SyncDetail, 
                      attributes: {exclude: ['createdAt', 'updatedAt']},
                      as: 'Details',
                    },{
                      model: I_SyncCategory, 
                      attributes: {exclude: ['createdAt', 'updatedAt']},
                    },{
                      model: I_SyncCohort, 
                      attributes: {exclude: ['createdAt', 'updatedAt']},
                    },{
                      model: I_SyncUp, 
                      attributes: {exclude: ['createdAt', 'updatedAt']},
                      limit: 1,
                      order: [
                        ["createdAt","desc"]
                      ],
                      include: [{
                        model: I_Log, 
                        attributes: {exclude: ['createdAt', 'updatedAt']},
                      }]
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
  },

}