# Some scenarios

Here are some scnarios that cover much of the waitlist example for accepting/declining offers.

### Scenario 1 (valid offer accept):
Actor: Student; Action: Student accepts offer

Given: 
- Student has offer
- Offer is not expired
- Offer has not already been accepted
- Student is not enrolled in Section
- Section is not full

When:
- Student accepts offer

Then:
- Student is enrolled in Section
- Offer is marked as accepted


### Scenario 2 (expired offer):
Actor: Student; Action: Student accepts offer

Given: 
- Student has offer
- Offer is expired
- Offer has not already been accepted
- Student is not enrolled in Section
- Section is not full

When:
- Student accepts offer

Then:
- Student is not enrolled in Section
- Offer is still expired

### Scenario 3 (accepted offer):
Actor: Student; Action: Student accepts offer

Given: 
- Student has offer
- Offer is not expired
- Offer has already been accepted
- Student is not enrolled in Section
- Section is not full

When:
- Student accepts offer

Then:
- Student is not enrolled in Section
- Offer is not expired
- Offer is still marked as accepted


### Scenario 4 (student already in section):
Actor: Student; Action: Student accepts offer

Given: 
- Student has offer
- Offer is not expired
- Offer has not already been accepted
- Student is enrolled in Section
- Section is not full

When:
- Student accepts offer

Then:
- Student is enrolled in Section
- Offer is __________________________ ?

### Scenario 5 (student declines offer):
Actor: Student; Action: Student declines offer

Given: 
- Student has offer
- Offer is not expired
- Offer has not already been accepted
- Student is not enrolled in Section
- Section is not full

When:
- Student declines offer

Then:
- Student is not enrolled in Section
- Offer is __________________________ ?
