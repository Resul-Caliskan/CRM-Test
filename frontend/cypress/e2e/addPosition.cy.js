describe('template spec', () => {
  it('passes', () => {
    cy.login()
    cy.wait(200)
    cy.addPosition()
  })
})