describe('template spec', () => {
  it('passes', () => {
    cy.userLogin()
    cy.wait(2000)
    cy.demandCandidate()
  })
})