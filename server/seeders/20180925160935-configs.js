'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('I_Config', [{
        key: 'MOODLE_STUDENT_ROLE_ID',
        name: 'ID rol para estudiantes de MOODLE',
        value: '9',
        description: 'ID del rol que se le da a los estudiantes en un aula virtual dentro de MOODLE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'MOODLE_TEACHING_ROLE_ID',
        name: 'ID rol para docente de MOODLE',
        value: '7',
        description: 'ID del rol que se le da a los profesores en un aula virtual dentro de MOODLE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'CREATE_USER_MOODLE_AUTH',
        name: 'Metodo autenticacion MOODLE',
        value: 'db',
        description: 'Metodo de autenticacion con el que se generan los usuarios en MOODLE: db o manual',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'CREATE_USER_MOODLE_EMAIL_DEFAULT',
        name: 'Email por defecto MOODLE',
        value: '@default.com',
        description: 'Dominio del mail que se utiliza por defecto al crear un usuario en moodle desde la interfaz',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'MOODLE_USER_DEFAULT_PASSWORD',
        name: 'Password por defecto MOODLE',
        value: '@1B2c3D4',
        description: 'Password por defecto que que se asigna por defecto al crear un usuario en moodle desde la interfaz',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'MOODLE_COURSE_SHORTNAME_PREFIX',
        name: 'Prefijo para cursos MOODLE',
        value: 'SIU-',
        description: 'Prefijo utilizado por los SHORTNAMES de los cursos creados en MOODLE desde la interfaz',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'MOODLE_IMPORT_CATEGORY_NAME',
        name: 'Nombre de categoria objetivo MOODLE',
        value: 'Importados',
        description: 'Nombre de subcategoria en la que se crean las aulas virtuales dentro de MOODLE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'SIU_QUERY_LIMIT',
        name: 'Limite comisiones SIU',
        value: '9999',
        description: 'Limite de comisiones que se obtienen de SIU al momento de listar las actividades',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'AUTHMODE',
        name: 'Metodo autenticacion GUARANI',
        value: 'BASIC',
        description: 'Metodo de autenticacion utilizado para acceder a los servicios de Siu Guarani: BASIC o DIGEST',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'SIU_FIXMISSINGUSERNAME',
        name: 'Fix nombres de usuario Guarani?',
        value: 'true',
        description: 'Intenta obtener el nombre de usuario a travez del dni en caso de que no exista este campo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'SIU_FIXMISSINGEMAIL',
        name: 'Fix emails de usuario Guarani?',
        value: 'true',
        description: 'Al no encontrar el mail para un determinado usuario de Siu Guarani. Le asigna una casilla de correo por defecto construida en base al nombre de usuario',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'SIU_FIXMISSINGNAME',
        name: 'Fix nombres de usuario Guarani?',
        value: 'true',
        description: 'Se debe completar el nombre con otro dato',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'SIU_FIXMISSINGLASTNAME',
        name: 'Fix apellido de usuario Guarani?',
        value: 'true',
        description: 'Se debe completar el apellido con otro dato',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'MOODLE_PREVENT_COLLAPSE',
        name: 'Se desea prevenir HTTP 503?',
        value: 'true',
        description: 'Se evita que el servidor de Moodle colapse',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'CRON_PERIODICITY',
        name: 'Periodicidad con que se desea ejecutar cron de sincronizacion',
        value: '0 0 * * * *',
        description: 'Ejecución cada una hora',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'MOODLE_URL',
        name: 'URL de Moodle',
        value: 'http://moodle-test.unahur.edu.ar',
        description: 'URL de Moodle',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'DEFAULT_SYNC_PERIODICITY',
        name: 'Periodicidad para sincronización',
        value: '24',
        description: 'Valor por defecto para la periodicidad con la que se ejecuta la sincronizacion automatica',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'DEFAULT_SYNC_DYAS',
        name: 'Cantidad de dias de la sincronizacion automatica',
        value: '0',
        description: 'Valor por defecto para la cantidad de días en la que se ejecuta la sincronizacion automatica. La "fecha desde" sera la fecha de creación y la "fecha hasta"  sera la "fecha desde" + este valor',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
    return;
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('I_Config', null, {});
    return;
  }
};