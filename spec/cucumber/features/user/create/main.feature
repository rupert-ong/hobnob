Feature: Create User

Clients should be able to send a request to our API in order to create a
user. Our API should also validate the structure or the payload and respond
with an error if it is invald.

Scenario Outline: Bad Client Requests

If the client sends a POST request to /users with an empty, unsupported or malformed payload,
it should receive a response with a 4xx Bad Request HTTP status code.

When the client creates a POST request to /users
And attaches a generic <payloadType> payload
And sends the request
Then our API should respond with a <statusCode> HTTP status code
And the payload of the response should be a JSON object
And contains a message property which says <message>

Examples:

| payloadType | statusCode  | message                                                       |
| empty       | 400         | "Payload should not be empty"                                 |
| non-JSON    | 415         | 'The "Content-Type" header must always be "application/json"' |
| malformed   | 400         | "Payload should be in JSON format"                            |

Scenario Outline: Bad Request Payload

If the client sends a POST request to /users with a JSON payload missing a email and/or password
property, it should receive a 400 Bad Request HTTP status code.

When the client creates a POST request to /users
And attaches a Create User payload which is missing the <missingFields> field
And sends the request
Then our API should respond with a 400 HTTP status code
And the payload of the response should be a JSON object
And contains a message property which says "Payload must contain at least the email and password fields"

Examples:

| missingFields |
| email         |
| password      |

Scenario Outline: Request Payload with Properties of an Unsupported Type

If the client sends a POST request to /users with a JSON payload when the email and/or password
field isn't of type string, it should receive a 400 Bad Request HTTP status code.

When the client creates a POST request to /users
And attaches a Create User payload whose <field> field is not a <type>
And sends the request
Then our API should respond with a 400 HTTP status code
And the payload of the response should be a JSON object
And contains a message property which says "The email and password fields must be of type string"

Examples:

| field     | type    |
| email     | string  |
| password  | string  |