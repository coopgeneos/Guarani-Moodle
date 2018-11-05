'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('I_Config', [{
        key: 'SIU_REST_URI',
        name: 'Rest URI de SIU Guarani',
        value: 'http://guarani.example.com/guarani/3.13/rest/',
        description: 'URI de servicios REST de SIU Guarani, ejemplo: http://guarani.example.com/guarani/3.13/rest/',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'MOODLE_REST_URI',
        name: 'Rest URI de Moodle',
        value: 'http://moodle.example.ar/webservice/rest/server.php',
        description: 'URI de servicios REST de MOODLE, ejemplo: http://moodle.example.ar/webservice/rest/server.php',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        key: 'MOODLE_ROOT_CATEGORY_ID',
        name: 'ID de categoria padre de MOODLE',
        value: '138',
        description: 'ID de la categoria padre dentro de MOODLE. Se define como categoria padre a la categoria que agrupa las categorias principales',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
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
        key: 'Email por defecto MOODLE',
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
        key: 'SIU_TOKEN',
        name: 'Credenciales de acceso a SIU',
        value: '',
        description: 'Credenciales de acceso a SIU',
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
      }
    ]);

    return;
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('I_Config', null, {});
    return;
  }
};