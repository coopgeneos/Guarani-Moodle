'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('I_User', [{
        name: 'Admin',
        surname: 'Admin',
        username: 'Admin',
        password: '6ed9aa9da96087f919dd5dda7be7db04',
        role: '0',
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);

    queryInterface.bulkInsert('I_Config', [{
        key: 'SIU_REST_URI',
        value: 'http://guarani-test.unahur.edu.ar/guarani/3.13/rest/',
        description: 'URI de servicios REST de SIU'
      },{
        key: 'MOODLE_REST_URI',
        value: 'http://moodle-test.unahur.edu.ar/webservice/rest/server.php',
        description: 'URI de servicios REST de MOODLE'
      },{
        key: 'MOODLE_ROOT_CATEGORY_ID',
        value: '138',
        description: 'ID de la categoria padre dentro de MOODLE. Se define como categoria padre a la categoria que agrupa las categorias principales'
      },{
        key: 'MOODLE_STUDENT_ROLE_ID',
        value: '9',
        description: 'ID del rol que se le da a los estudiantes en un aula'
      },{
        key: 'MOODLE_TEACHING_ROLE_ID',
        value: '7',
        description: 'ID del rol que se le da a los profesores en un aula'
      },{
        key: 'CREATE_USER_MOODLE_AUTH',
        value: 'db',
        description: 'Metodo de autenticacion con el que se generan los usuarios'
      },{
        key: 'CREATE_USER_MOODLE_EMAIL_DEFAULT',
        value: '@default.com',
        description: 'Dominio del mail que se utiliza por defecto al crear un usuario'
      },{
        key: 'MOODLE_USER_DEFAULT_NAME',
        value: '@1B2c3D4',
        description: 'Password por defecto que que se asigna por defecto al crear un usuario'
      },{
        key: 'MOODLE_COURSE_SHORTNAME_PREFIX',
        value: 'SIU-',
        description: 'Prefijo utilizado por los SHORTNAMES de los cursos creados en MOODLE'
      },{
        key: 'MOODLE_IMPORT_CATEGORY_NAME',
        value: 'Importados',
        description: 'Nombre de subcategoria en la que se crean los cursos'
      },{
        key: 'SIU_QUERY_LIMIT',
        value: '1',
        description: 'Limite de comisiones que se obtienen de SIU (Deprecado)'
      },{
        key: 'PREFIX',
        value: 'M-',
        description: 'Prefijo de cursos creados en SIU (Deprecado)'
      },{
        key: 'AUTHMODE',
        value: 'BASIC',
        description: ''
      },{
        key: 'SIU_FIXMISSINGUSERNAME',
        value: 'true',
        description: 'Intenta obtener el nombre de usuario a travez del dni en caso de que no exista este campo'
      },{
        key: 'SIU_FIXMISSINGEMAIL',
        value: 'true',
        description: 'Al no encontrar el mail para un determinado usuario de Siu Guarani. Le asigna una casilla de correo por defecto construida en base al nombre de usuario'
      }
      ]);

    return;
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('I_User', null, {});
    queryInterface.bulkDelete('I_Config', null, {});
    return;
  }
};