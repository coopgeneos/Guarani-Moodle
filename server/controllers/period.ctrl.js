const C_SIU_School_Period = require('./../models').C_SIU_School_Period

module.exports = {
  getAll: (req, res, next) => {
    let currentYear = new Date();
    currentYear = currentYear.getFullYear();
    C_SIU_School_Period.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}, where: {year: currentYear}})
      .then(periods => {
        let obj = {success: true, data: periods};
        res.send(obj);
      })
      .catch(err => {
        console.log(err);
        let obj = {success: false, msg: 'Hubo un error al consultar los períodos lectivos'};
        res.send(obj);
      })
  }
}