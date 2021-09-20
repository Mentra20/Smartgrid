Feature: Production

  Scenario: As Pierre & Marie, I want to see the electricity consumption of my household
    When I ask the supplier for production at "http://localhost:3002/production"
    Then the production should be 200
