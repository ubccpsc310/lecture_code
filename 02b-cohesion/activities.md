# 02b Lecture Activities

## Ticket FEAT-0002

The loyalty scheme is being expanded. A customer's status comes from how many distinct program categories they have taken:

- 3 or more categories → "Frequent Customer" (already the rule)
- 5 or more → "Community Champion" (new)
- Going on a waitlist counts too!

Think: how many places would you have to modify to do this change?
Implement: get the feature working in the most direct way.
Describe: what are the degree, locality, and connascence of this coupling?

## Identifying Cohesion

Examine the FEAT-0002 diff

1. Within code block 1:
  - How is line 1 cohesive with line 2?
  - How is line 1 cohesive with line 4?
  - How is line 3 cohesive with line 4?
2. Between code blocks A and B:
  - How are they cohesive?
