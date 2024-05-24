// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
    cy.visit('http://localhost:3001')
    cy.get('input[data-test="email"]').type('admin@venhancer.com')
    cy.wait(200)
    cy.get('input[data-test="password"]').type('efeadmin')
    cy.wait(200)
    cy.get('button[data-test="loginbutton"]').click()
    cy.wait(200)
   
   
  });

  Cypress.Commands.add('failedLogin', () => {
    cy.visit('http://localhost:3001')
    cy.get('input[data-test="email"]').type('invalid@venhancer.com') // Geçersiz email
    cy.wait(200)
    cy.get('input[data-test="password"]').type('1125125125') // Geçersiz şifre
    cy.wait(200)
    cy.get('button[data-test="loginbutton"]').click()
    cy.wait(200)
   
   
});

Cypress.Commands.add('newCustomerRecord', () => {
   
    cy.get('button[data-test="newrecord"]').click() 
    cy.wait(200)
    cy.get('input[data-test="companyname"]').type('Yeni Şirke12313')
    cy.get('div[data-test="companytype"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Anonim').click() 

    cy.get('div[data-test="companyindustry"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Bankacılık').click() 

    cy.get('input[data-test="website"]').type('yeni22141.com')

    cy.get('input[data-test="contactperson"]').type('Yeni Adam223')

    cy.get('input[data-test="contactmail"]').type('yeniadam212313@gmail.com')

    cy.get('input[data-test="phone"]').type('5513675678')

    cy.get('div[data-test="country"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Afganistan').click() 
    
    cy.get('div[data-test="city"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Balkh').click() 

    cy.get('div[data-test="county"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Khulm').click() 

    cy.get('textarea[data-test="address"]').type('Afganistan')

    cy.get('button[data-test="addCustomer"]').click() 
   
});


Cypress.Commands.add('addPosition', () => {
   
    cy.get('[data-test="listposition"]').click();


    cy.contains('button', 'Yeni Kayıt').click();
    cy.wait(200)

    cy.get('div[data-test="positioncompany"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Venhancer').click()
    
    cy.get('div[data-test="jobtitle"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Frontend Developer').click()

    cy.get('div[data-test="department"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('IT').click()

    cy.get('div[data-test="experienceperiod"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('3-5 Yıl').click()

    
    cy.get('div[data-test="modeofoperation"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('İş yerinde').click()

    cy.get('div[data-test="workingtype"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Tam Zamanlı').click()


    cy.get('div[data-test="industries"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Bankacılık').click()

    cy.get('div[data-test="skills"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('React').click()
    cy.get('[data-test="skills"]').type('{enter}');
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Vue').click()
    cy.get('[data-test="skills"]').type('{enter}');
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('ux design').click()

    cy.get('div[data-test="bannedcompanies"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Vodafone').click()

  
    cy.get('div[data-test="city"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Adana').click()

    
    cy.get('div[data-test="county"]').click() // Dropdown'u aç
    cy.wait(200)
    cy.get('.ant-select-item-option-content').contains('Ceyhan').click()

    cy.get('textarea[data-test="positionaddress"]').type('Adana Ceyhan Hürriyet Mahallesi')

    cy.get('button[data-test="aidescription"]').click()
    cy.wait(15000)

    cy.get('button[data-test="saveposition"]').click()

});


Cypress.Commands.add('systemParameters', () => {
  
    cy.get('[data-test="systemparameters"]').click();
   
    cy.get('input[data-test="parametersearch"]').type('Vodafone')

    cy.get('[data-test="editparameter"]').click();
});


Cypress.Commands.add('userLogin', () => {
    cy.visit('http://localhost:3001')
    cy.get('input[data-test="email"]').type('yusufkaratay808@gmail.com')
    cy.wait(200)
    cy.get('input[data-test="password"]').type('123456')
    cy.wait(200)
    cy.get('button[data-test="loginbutton"]').click()
    cy.wait(200)
   
   
  });

// query selector
  Cypress.Commands.add('demandCandidate', () => {
    
    cy.get('[data-test="candidatetab"]').click()
    cy.get('button[data-test="nomineedetail"]',{multiple:true}).click()
    console.log(cy.get('button[data-test="nomineedetail"]'))
   
   
  });


  