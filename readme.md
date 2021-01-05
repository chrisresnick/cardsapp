- Concept - web app version of Anki, with some social features

- Core Features:
    - Ability to create a new deck
    - Ability of add/remove cards from a deck
    - Ability to edit cards
    - Ability to run through a deck
        - Next date to show the deck set based on  how dificult the question was rated
    - Ability to search decks/cards
    - Ability to share Decks

- Social Features:
    - Create a Class
    - Students can join a class
    - The owner of the class can push a deck to the class and all the students get it

- Possible Extras
    - Ability to parse a .anki file



- Database
    - Users
        - ID - Serial
        - Username - String
        - Email - String
        - Hashed Password - String


    - Decks
        - ID - Serial
        - Name - String
        - Owner - Int, foreign key => Users
        - ShareType - Enum(private, public, shared)
        - ReadOnly - Bool

    - Cards
        - ID - Serial
        - Deck - Int, Foreign Key => Decks
        - Question - String
        - Answer - String
        - NextShow - DateTime

    - Class
        - PK - Serial
        - Name - String
        - OwnerID - INT, Foreign Key => User

    - Enrolment (join table)
        - StudentID INT, Foreign Key => User
        - ClassID Int, Foreign KEy => Class

    - Notification
        - ID - Serial
        - Message - String
        - Seen - BOOL
        - CreatedAT - DateTime

    - JoinClassRequest
        - ID - Serial
        - User - INT Foreign Key => User
        - Class - INt Foreign Key => Class

- Technologies
    - Chakra.UI

- Routes
    - Backend (core)
        - POST /users
            - Register a new User
        - POST /session
            - Login
        - Delete /session
            -Logout
        - POST /decks
            - Create a new Deck
        - DELETE /deck/id
            - Delete a deck
        - GET /decks/id
            - Get a deck
        - POST /Decks/:id/cards
            - Create a new Card in a deck
        - DELETE /decks/id/cards/id
            -delete a card
        - PUT /decks/id/cards/id
            - Edit a card
        - GET /decks/id/cards/id
            - get a card

    - Backend (social)
        - POST /classes:
            - create a class
        - DELETE /classes
            - delete a class
        - POST /classes/id
            - Join a class
        - GET /classes/id
            - See info for a class
        - DELETE /classes/id/students/id
            - leave a class
        - POST /classes/id/decks
            - Publish a deck to a class
        - GET /users/id/notifications
            - Get notifications for a user



- Components
    - Deck
    - Card
    - GamePlayer
    - NavBar
    - JoinClass
    - Notifications (drop down)
    - ClassStudentView
    - ClassInstructorView
