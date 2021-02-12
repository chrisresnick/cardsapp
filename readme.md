# Cards App

## Concept 

- This is a web app for creating and studying decks of flash cards. There are also social features, including the ability to create classes, request to join classes, approve and deny requests, and share decks of cards with your class. 
- This app uses flask for the backend with a postgreSQL database. React is used for the front end. 


# Core Features:
- Ability to create a new deck
- Ability of add/remove cards from a deck
- Ability to edit cards
- Ability to study a deck
    - The next time to show the card is based on how hard the user says the questions was
- Ability to search decks/cards
- Ability to share Decks

- Social Features:
    - Create a Class
    - Students can join a class
    - Users get notifications when someone tries to join their class
    - Users and approve or deny requests
    - The owner of the class can publish a deck to the class and all the students get it



# Database Schema
- Users
    - ID - Serial
    - Username - String
    - Email - String
    - Hashed Password - String

- Decks
    - ID - Serial
    - Name - String
    - ClassId - Int foreign key => Classes
    - OwnerId - Int, foreign key => Users
    - ShareType - Enum(private, public, shared)
    - ReadOnly - Bool

- Cards
    - ID - Serial
    - DeckId - Int, Foreign Key => Decks
    - Question - String
    - Answer - String
    - NextShow - DateTime

- Class
    - ID - Serial
    - Name - String
    - OwnerID - INT, Foreign Key => User
    - Key - String (uuid)

- Enrolments (join table)
    - StudentID INT, Foreign Key => User
    - ClassID Int, Foreign KEy => Class

- Notifications
    - ID - Serial
    - Message - Text
    - forUserId - Integer, indexed, foreignKey => Users
    - forReqestId - Integer, foreignKey => enrollmentRequests
    - noteType - enum("request", "approve", "deny", "deck")
    - Seen - BOOL
    - CreatedAT - DateTime

- enrollmentRequest
    - ID - Serial
    - StudentId - INT Foreign Key => Users
    - ClassId - Int Foreign Key => Classes

# Technologies Used
    - Flask
    - PostgreSQL
    - React
        - Chakra.UI

# /api/ Routes
- Core
    - PUT <b>/cards/<int:id></b> - edit a card
    - DELETE <b>/cards/<int:id></b> - delete a card
    - GET <b>/cards/due</b> - get all the cards for the current user that are due now
    - POST <b>/cards/study</b> - called every time a cards is studied. Updates the due date
    - POST <b>/decks/</b> - create a new deck
    - POST <b>/decks/<int:id>/cards</b> - create a new card in a given deck
    - GET <b>/decks/<int:id></b> - fetch the data for a deck
    - GET <b>/decks/<int:id>/cards</b> - fetch all the cards in a given deck
    - GET <b>/decks/<int:id>/due</b> - get all the cards in a given deck that are due
    - POST <b>/decks/<int:id>/rename</b> - rename a deck
- Social
    - GET <b>/classes</b> - get all the classs data for the current user
    - POST <b>/classes</b> - create a new class
    - POST <b>/classes/enroll</b> - create a new enrollment request
    - POST <b>/classes/<int:id>/publish</b> - publish a deck of cards to a given class
    - DELETE <b>/notes/<int:id></b> - delete a given notification
    - POST <b>/notes/<int:id>/deny</b> - deny the request associated with a given notification
    - POST <b>/notes/<int:id>/accept</b> - approve the request associated with a given notification
    - GEt <b>/users/<int:id>/navnums</b> - fetch all the notifications and the cards that a due for a user
    



# React Components
- Decks View
    - Deck
    - PlaceHolder
    - Create Modal
- Card Views
    - Card
    - PlaceHolder
    - Create Modal
    - Edit Modal
 - Study View
 - Classes View
 - NavBar
    - Notifications

