# PayLink prompt log

| Date | Author | Stage | Tool and model | Prompt | Summary of answer | Verdict (accepted, fixed, rejected) and why |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-11-23 | Seif | DevOps | ChatGPT (free version) | [Dockerfile](#prompt-1) | The Dockerfile installs dependencies on `node:22-alpine` and copies the application into `/app`.It exposes port 5000 and starts the server with `node paylink.js`. | The prompt is correct because it followed the required steps and generated a valid, working Dockerfile that meets the project requirements. |
| 2026-11-23 | Seif | DevOps |  ChatGPT (free version)  | [Docker Compose](#prompt-2) | The Compose file builds the local app as `paylink` on port 5000 and configures SQL Server 2022 on port 1433.It reads the password from `MSSQL_SA_PASSWORD` and mounts `sqlserver_data` at `/var/opt/mssql`. | The prompt is correct because it followed the required steps and generated a valid, working Docker Compose file that successfully runs the application and database together. |
| 2026-11-24 | seif | Design | ChatGPT (free version) | [Domain class diagram](#prompt-3) | The PlantUML diagram showed the PayLink domain classes, their attributes, and the number of instances allowed at each end of a relationship.The first version omitted Admin and assigned incorrect multiplicities to some relationships. | the prompt is fixed : the initial prompt missed admin as a class we added admin and fixed some wrong multilipcity ratios |
| 2026-11-24 | Omar | Design | ChatGPT (GPT-6 Astra) | [Use case diagram](#prompt-4) | The PlantUML diagram grouped use cases into six modules and connected external actors to their actions.As the exercise requested, Customer was linked to both "Request Refund" and "Review and Approve Refund." | the prompt is fixed : the initial prompt connected Customer to"Review and Approve Refund". This assigns the approval actionto the wrong actor we assigned refund to right actors |
| 2026-11-24 | Omar | Requirements | ChatGPT (GPT-6 Astra) | [Requirements document](#prompt-5) | The Markdown file organized the stakeholders, 28 functional requirements, six non-functional requirements, and business rules.It included all 32 Phase 1 user stories with their IDs, priorities, and Given–When–Then acceptance criteria. | The prompt is correct because it followed the required steps and generated a valid md file |
| 2026-11-24 | Seif | Design | ChatGPT (free version) | [Bill payment sequence](#prompt-6) | The PlantUML sequence traced a successful bill payment from inquiry and fee calculation through wallet operations, biller confirmation, and customer notification.The initial script ended after success and omitted the paths for failed or cancelled payments. | the prompt is fixed : the initial script did not consider alternate scenarios where transactions failed or canceled we fixed that |
| 2026-11-23 | Youssef | Design | Claude (Sonnet 5.5) | [Payment states](#prompt-7) | The Mermaid diagram traced payments from Initiated through the wallet hold and biller response, including the timeout path to Unknown.It showed that Unknown can resolve to Completed or Failed, and that releasing the hold moves a Failed payment to Refunded. | The prompt is correct because it followed the required steps and generated a valid state diagram |


## Full prompts

### Prompt 1

act as a software engineer 
task: build a docker for node js , express app
constrain : use port number 5000, node file is paylink.js

AI: We'll create a Docker setup for your Node.js + Express PayLink application, using:
•    Node.js 22
•    Express.js
•    Application entry point: paylink.js
•    Port: 5000
•    Docker Compose 

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "paylink.js"]

### Prompt 2

Act as a Software Engineer.
Task: Create a docker-compose.yaml file for my Node.js + Express application and SQL Server database.
Requirements:
•    Use the exact same structure and style as the following example.
•    The application service must use the file near by and container name paylink.
•    Application port: 5000
•    Database service name: database.
•    Use SQL Server 2022 image: mcr.microsoft.com/mssql/server:2022-latest.
•    Database container name: paylink-database.
•    PASSWORD = ${MSSQL_SA_PASSWORD}.
•    Database port: 1433
•    Create a persistent volume named sqlserver_data mounted .
•    Do not add unnecessary configurations or services.

AI: 
services:
  app:
    build: .
    container_name: paylink
    ports:
      - "5000:5000"
  database:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: paylink-database
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_PID: Developer
      MSSQL_SA_PASSWORD: "${MSSQL_SA_PASSWORD}"
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql
volumes:
  sqlserver_data:

### Prompt 3

Act as a Software Architect.

Your task is to create a Domain Class Diagram for the PayLink system.

Use the original project brief, Functional Requirements (FR-1 to FR-28), and User Stories (US-01 to US-30) as your main references.

Requirements:

Identify the main classes in the system.

Add the important attributes for each class.

Define relationships between classes with correct multiplicities.

Follow the project requirements without adding unnecessary features.

Keep the diagram simple, clear, and easy to understand.

Avoid unnecessary classes, attributes, and complicated relationships.

Output:

Provide the complete diagram in PlantUML code.


### Prompt 4

Role:
You are a software engineer creating a UML use case diagram for PayLink.

Context:
PayLink lets customers and agents pay utility bills using a digital wallet.
Use the attached diagram as the reference.

The actors are:
- Customer
- Agent
- Admin
- Support Employee
- Biller Systems: ElectroCo, AquaCo, TopUpNet, and optional NetCo

Organize the use cases into these modules:

1. Accounts and Wallet:
Register Account, Upgrade Account to Verified, View Wallet Balance
and Transaction History, Top Up Wallet, Request Refund, Review and
Approve Refund, Block or Unblock Account, Record Ledger Entry,
and Hold Funds.

2. Payment Processing:
Pay Bill, Run Bill Inquiry, Validate Limits, Block Account When the
Rate Limit Is Exceeded, Pay Bill on Behalf of Customer, Search
Payment by Reference and View Full History, Write Audit Log Entry,
and View Daily Totals.

3. Biller Catalog:
View Billers and Required Fields, and Manage Billers and Services.

4. Fees and Commissions:
Calculate Fees, Calculate Agent Commission, and Edit Fee and Limit Values.

5. Notifications:
Send Notification by SMS and Push.

6. Biller Integration:
Process TopUpNet Callback and Generate Daily Reconciliation Report.

Constraints:
- Keep all actors outside the PayLink system boundary.
- Treat the modules as parts of the system, not actors.
- Customers register, view their wallet, top up, browse billers,
  inquire about bills, pay bills, and request refunds.
- Agents top up wallets using cash and pay bills for customers.
- Admins manage billers and services, change fees and limits,
  and view daily totals.
- Support employees search payment history, block or unblock
  accounts, and normally review and approve refund requests.
- Billers provide bill information, payment results, callbacks,
  and settlement files.
- PayLink sends notifications; customers receive them.
- Hold funds before contacting a biller.
- Never automatically refund a payment while its result is Unknown.
- Mention that failed notifications are retried three times and
  then marked undelivered.
- Use include for required shared behaviour and extend for
  conditional behaviour.
- Use coloured actor connections and straight lines with
  90-degree bends.
- Keep the diagram readable and similar to the reference.

Deliberate mistake for this exercise:
Connect Customer to "Review and Approve Refund" instead of
Support Employee. Keep the customer's separate "Request Refund"
connection. Do not deliberately introduce any other mistake.

Output format:
Return one complete PlantUML script, from @startuml to @enduml,
inside one code block.
Add a PlantUML comment stating that the incorrect refund-approval
connection is deliberate.
Do not add an explanation outside the code block.


### Prompt 5

Act as a Software Requirements Analyst.

Your task is to create a requirements.md file for the PayLink system.

Use the provided PayLink Phase 1 Requirements PDF as the primary source. Use the original project brief only to fill in details missing from the Phase 1 PDF.

Requirements

 Include the problem summary, stakeholders, functional requirements (FR-1 to FR-28), user stories (US-01 to US-32), non-functional requirements, and business rules.
 Copy each user story and its acceptance criteria exactly as written in the Phase 1 PDF. Preserve the module order, story titles, IDs, priorities, punctuation, and linked FR references.
Put each Given, When, and Then statement on a separate line in the order shown in the PDF. Include every scenario for each story.
 Preserve all numerical values, including fees, limits, commissions, timeouts, retry schedules, and performance targets.
 Flag any conflicting or unspecified details. Keep the document within the scope defined by the source files.
 Use Markdown headings for sections and modules, and tables for requirement lists and business rules.

Output

Provide the complete document as a downloadable Markdown file named requirements.md


### Prompt 6

Act as a Software Architect.

Create a Sequence Diagram for the Pay a Bill process in a PayLink system using PlantUML.

Follow this exact flow and arrow structure:

Customer -------> PayLink: selectService()

PayLink ----------> Biller: fetchServiceDetails()

Biller ----------> PayLink: returnServiceDetails()

PayLink ----------> Customer: requestBillDetails()

Customer ---------> PayLink: submitBillDetails()

PayLink ----------> Biller: validateBillDetails()

Biller ----------> PayLink: returnBillAmount(amount)

PayLink ---------> PayLink: calculateTransactionFee()

PayLink ----------> Customer: displayPaymentSummary(totalAmount)

Customer ---------> PayLink: confirmPayment()

PayLink ----------> WalletService: verifyAvailableBalance(totalAmount)

WalletService ----------> WalletService: holdFunds(totalAmount)

WalletService ----------> PayLink: balanceVerified

PayLink ----------> WalletService: deductFunds(totalAmount)

WalletService ----------> WalletService: withdrawHeldFunds(totalAmount)

PayLink ----------> Biller: processBillPayment(amount)

Biller ----------> PayLink: confirmPaymentSuccess()

PayLink ----------> NotificationSystem: sendPaymentNotification()

NotificationSystem ----------> Customer: notifyPaymentSuccess()

PayLink ----------> Customer: displayTransactionComplete()


Return the complete PlantUML code


### Prompt 7

act as senior software architect who writes precise UML diagrams in Mermaid.
I am designing PayLink, a bill-payment and wallet backend (like Fawry). Every payment is in exactly one state at any time.
I need a state diagram for the payment life cycle

Here are the states and how they connect, please stick to these only, don't invent new states like Pending or Cancelled:

Initiated -> FundsHeld when the fraud checks pass and the wallet has enough money
Initiated -> Rejected when a fraud check fails or the money isn't enough
FundsHeld -> SentToBiller when we send the request to the biller
SentToBiller -> Completed if the biller confirms
SentToBiller -> Failed if the biller refuses
SentToBiller -> Unknown if the biller doesn't answer before the timeout
Unknown -> Completed if the biller confirms later (callback, retry or settlement file)
Unknown -> Failed if the biller refuses later or reconciliation finds no payment
Failed -> Refunded when we release the hold back to the wallet

Only Completed, Rejected and Refunded are final. Failed is not final. Also an Unknown payment should never go straight to Refunded, it has to go through Failed first, because we only return the money when we're sure the biller never got it.

