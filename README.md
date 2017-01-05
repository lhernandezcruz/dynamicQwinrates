# Does not work because RIOT does not do dynamic queue anymore. 

# dynamicQwinrates
Lets players find out winrates that they have as a group.
 
# How To Use
Simply choose region (na by default) and the amount of players in dynamic group (2 by default) and then enter the summoner names. It will fetch the games and display the winrate.

# How it works
I used Openshift to deploy my Node.js app that uses async, body-parser, express, path and simple-rate-limiter. It gets the games of each player and finds which they have in common and checks whether they won or lost.
