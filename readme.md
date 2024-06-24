# Backend Developer Role Technical Assessment

## Scenario

Fitness+ offers gym memberships with various billing structures. Some memberships are annual with a single upfront payment, while others have monthly dues. Additionally, members can subscribe to optional add-on services (personal training sessions, towel rentals) with separate monthly charges. Here's the twist:

- For new members, the first invoice combines the annual membership fee with the first month's charges for any add-on services they choose.
- In subsequent months, only the monthly charges for the add-on services are billed.

## Task

Develop a backend system that implements the following functionalities based on your expertise in these frameworks to build a robust and scalable backend API. Consider Express.js and MongoDB, well-documented RESTful APIs, and you can use your Gmail SMTP server to send out the mails.

### 1. Data Model

Design a data model to store information about gym memberships, including:

- Membership ID (unique identifier)
- First Name
- Last Name
- Membership type (e.g., Annual Basic, Monthly Premium)
- Start date
- Due date (for annual memberships) or monthly due date (for add-on services)
- Total amount (for annual memberships) or monthly amount (for add-on services)
- Member email address
- IsFirstMonth (boolean flag indicating if it's the first month of the membership)
- (Optional) Link to the detailed membership invoice

### 2. Cron Job Implementation

Develop a cron job that will run periodically (e.g., daily) to check for upcoming membership fees. The cron job should:

- Query the database for memberships with upcoming due dates.
- Differentiate between annual memberships and add-on services, considering the IsFirstMonth flag.

For new members (first month):

- Calculate the reminder date (e.g., 7 days before the due date) based on the annual membership due date.
- Send an email reminder with the membership type, total amount for the combined annual fee and first month's add-on service charges, and a link to the full invoice detailing both.

For existing members (subsequent months):

- Check if the current date falls within the month for which the add-on service applies.
- If yes, send an email reminder with the service name, monthly amount, and a link to the invoice for that specific month's add-on service charge.

### 3. Email Functionality

Implement a mechanism to send email reminders using an email service provider (ESP) or a local mail server (your choice). The email should contain:

- **Subject**: Fitness+ Membership Reminder - [Membership Type]
- **Body**: A message reminding the member about the upcoming payment, including the membership details (type, due date for annual or month for add-on services), and a link to the relevant invoice. Clearly differentiate between the first month's combined invoice and subsequent month's add-on service invoices in the message.


## Solution Overview

This project implements a backend system to handle the membership and billing scenarios described above. It includes:
1. A data model to store membership information.
2. A cron job to send email reminders for upcoming payments.
3. Email functionality to send reminders using a Gmail SMTP server.

## Endpoints

### Create Membership

- **URL**: `/api/v1/member/membership`
- **Method**: `POST`
- **Description**: Create a new gym membership.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "membershipType": "Annual Basic",
    "startDate": "2023-06-01",
    "dueDate": "2024-06-01",
    "monthlyDueDate": "2023-07-01",
    "totalAmount": 1200,
    "monthlyAmount": 100
  }

1. **Clone the repository**: `git clone [[https://github.com/kobiowuquadri/fitness-plus-backend.git]]`
2. **Install dependencies**: `npm install`
3. **Create a `.env` file** and configure your environment variables
              
4. **Start the server**: `npm run dev`

## Contributing

Feel free to contribute by submitting pull requests to enhance the functionality of this project.

## License

[MIT License](LICENSE)
