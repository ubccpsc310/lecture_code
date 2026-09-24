# 02a Lecture Activities

## Warmup: Make the change!

FEAT-0000: Currently the Instructor class only supports one `name` field, but we want to be able to specify a first and/or last name.

## Think/Pair/Share: Pricing a Feature

FEAT-0001: A new measure was just passed giving seniors (residents 65+) free admission to Aquatics and Fitness, funded by an increase of the non-resident surcharge from 25% to 30%.

With a partner examine the codebase and list what files, classes, and methods you would need to edit to implement this change (without actually making the change). How easy it was to identify each location?

## Coupling Strength (Connascence)

Examine diffs/feat0001.patch

With a partner, discuss how you would categorize the strength of the coupling for FEAT-0001. In other words, what do the main components being changed have to agree on? Is it a constant variable, data, logic, algorithm, etc?

## Ticket FEAT-0002

The loyalty scheme is being expanded. A customer's status comes from how many distinct program categories they have taken:
- 3 or more categories → "Frequent Customer" (already the rule)
- 5 or more → "Community Champion" (new)
- Going on a waitlist counts too!

Think: how many places would you have to modify to do this change?
Describe: What are the degree, locality, and connascence of this coupling?
