Feature: Consumption

  Scenario: As Pierre & Marie, I want to see the electricity consumption of my household
    When I ask my house for consumption at "http://localhost:3000/consumption"
    Then the consumption should be 200
