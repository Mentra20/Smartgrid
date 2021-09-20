Feature: Production

  Scenario: As Nikola, I need to guarantee that the production is equal to the consumption on the whole grid
    When I ask the supplier for production at "http://localhost:3002/production" and the total-consumption at "http://localhost:3003/total-consumption"
    Then the production and the total-consumption should be equal
