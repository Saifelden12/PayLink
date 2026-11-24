# PayLink Phase 1 requirements

## 1. Problem and scope

PayLink is an Egyptian bill-payment service. Customers pay electricity, water, mobile and internet bills from a wallet using the app or a shop agent’s terminal. PayLink earns a service fee and shares it with the agent on completed shop payments. Phase 1 delivers the backend.

The main financial risks are charging twice and charging for a payment the biller never received. The backend derives balances from ledger entries, reserves the total before contacting a biller, and captures the funds only after confirmation. While the outcome is uncertain, the funds stay held. Nightly reconciliation compares PayLink’s records with each biller’s settlement file.

## 2. Stakeholders

| Stakeholder | What they need | Related requirements |
| --- | --- | --- |
| Customer using the app | Fast payment, a quote before confirming, accurate balance, a receipt, funds returned on confirmed failure and protection from duplicate charges | FR-1, 3, 4, 7–10, 12, 18, 22, 27 |
| Shop agent with a terminal | Pay for walk-in customers, take cash top-ups and earn 40% of the fee on completed agent payments | FR-4, 17 |
| Operations admin | Maintain billers, update fees and limits without redeploying and see daily totals | FR-6, 24, 25, 28 |
| Support employee | Trace payments by reference, manage account blocks, check settlement differences and approve refunds | FR-20, 21, 26, 27 |
| Billers | Receive each payment once, with a unique reference in the correct format, and settle the correct amount | FR-13, 14, 15, 26 |
| Egyptian financial authorities | Evidence of safe customer funds, traceable transactions and nonnegative balances | FR-5, 25 |
| PayLink owners and finance team | Accurate fees and commissions, fewer complaints and straightforward biller onboarding | FR-16, 17, 28 |
| Developers, teaching assistant and instructor | Clear requirements, modular design and working CI/CD | Technical and quality requirements |

## 3. Functional requirements



| ID | Priority | Requirement |
| --- | --- | --- |
| FR-1 | Must | Register a customer account with Basic verification. |
| FR-2 | Should | Upgrade an approved customer to Verified and raise their payment limits. |
| FR-3 | Must | Show available and held wallet balances and transaction history. |
| FR-4 | Must | Accept wallet top-ups by simulated card or agent cash. |
| FR-5 | Must | Record each balance change in the ledger and calculate balances from ledger entries. |
| FR-6 | Must | Allow an admin to add, edit and disable billers and their services. |
| FR-7 | Must | List available billers, services and the input fields each service requires. |
| FR-8 | Must | Show the bill amount, service fee and total payable before confirmation. |
| FR-9 | Must | Allow a customer to pay a bill from their wallet. |
| FR-10 | Must | Return the original result when a request repeats an idempotency key. |
| FR-11 | Must | Enforce only the payment transitions permitted by project brief §2.5. |
| FR-12 | Must | Reserve funds before calling the biller. Release the hold on confirmed failure. |
| FR-13 | Must | Mark a timed-out payment Unknown and re-query it on the configured schedule. |
| FR-14 | Must | Accept asynchronous TopUpNet callbacks and ignore duplicates. |
| FR-15 | Must | Support ElectroCo, AquaCo and TopUpNet in their respective formats. NetCo batch support is optional. |
| FR-16 | Must | Calculate fees according to project brief §2.6, including promotions. |
| FR-17 | Should | Allow an agent to pay for a customer and earn commission on completion. |
| FR-18 | Must | Reject payments outside single-payment limits or above the daily limit and explain the reason. |
| FR-19 | Should | Block an account for 10 minutes when it makes more than five payments in 60 seconds. |
| FR-20 | Must | Allow support to find a payment by reference and view its full history. |
| FR-21 | Should | Allow support to block and unblock customer accounts. |
| FR-22 | Must | Send both SMS and push notifications when a payment completes or fails. |
| FR-23 | Should | Retry failed notifications up to three times and mark them undelivered if all retries fail. |
| FR-24 | Should | Allow an admin to change fees and limits without redeploying. |
| FR-25 | Must | Write every money movement and admin action to the audit log. |
| FR-26 | Should | Generate a daily reconciliation report from biller settlement files. |
| FR-27 | Could | Allow a customer to request a refund of a completed payment and support to approve it. |
| FR-28 | Could | Show admins daily payment totals, fees earned, commissions paid and failures per biller. |

## 4 User Stories

PayLink - User Stories Organized by Modules

### 1. Accounts and Wallet

Customers, agents, verification levels, wallets, ledger entries, holds, top-ups, and refunds. Also covers blocking and unblocking accounts.

#### US-01: Customer Registration (FR-1)　 **Must**

As a customer, I want to create an account, so that I can use PayLink services.

**Acceptance Criteria:**

**Given** a new customer with valid registration details,  
**When** they submit the registration form,  
**Then** the system creates an account with Basic verification level.

#### US-02: Upgrade Verification Level (FR-2)　 **Should**

As a customer, I want to upgrade my verification level, so that I can have higher transaction limits.

**Acceptance Criteria:**

**Given** a customer with Basic verification level who has requested an upgrade,  
**When** the system approves the verification,  
**Then** their level changes to Verified and their limits are raised.

#### US-03: View Wallet Balance (FR-3)　 **Must**

As a customer, I want to view my wallet balance, so that I know how much money I can use.

**Acceptance Criteria:**

**Given** a customer with an existing wallet,  
**When** they open the wallet page,  
**Then** the system displays their available and held balances.

#### US-04: View Transaction History (FR-3)　 **Must**

As a customer, I want to view my transaction history, so that I can track my previous transactions.

**Acceptance Criteria:**

**Given** a customer with previous transactions,  
**When** they open the transaction history page,  
**Then** the system displays their transactions.

#### US-05: Top Up Wallet Using Card (FR-4)　 **Must**

As a customer, I want to add money to my wallet using a simulated card, so that I can pay my bills.

**Acceptance Criteria:**

**Given** valid card details and a valid top-up amount,  
**When** the customer submits a top-up request,  
**Then** the system increases the wallet balance by that amount.

#### US-06: Agent Cash Top Up (FR-4)　 **Must**

As a customer, I want to add cash to my wallet through an agent, so that I can fund my wallet without using a card.

**Acceptance Criteria:**

**Given** a customer and an authorized agent,  
**When** the agent completes a cash top-up,  
**Then** the system increases the customer's wallet balance.

#### US-07: Ledger Management (FR-5)　 **Must**

As a system, I want to record every wallet balance change in the ledger, so that all balances can be calculated accurately.

**Acceptance Criteria:**

**Given** a successful money movement,  
**When** the wallet balance changes,  
**Then** the system creates a ledger entry.

#### US-14: Hold Funds Before Payment (FR-12)　 **Must**

As a system, I want to hold the payment amount before contacting the biller, so that the customer cannot spend the same money twice.

**Acceptance Criteria:**

**Given** a valid payment request with sufficient available balance,  
**When** payment processing starts,  
**Then** the system holds the required amount before calling the biller.

**Given** a held amount and a failed payment,  
**When** the failure is confirmed,  
**Then** the system releases the held amount back to the available balance.

#### US-23: Block and Unblock Accounts (FR-21)　 **Should**

As a support employee, I want to block and unblock customer accounts, so that I can handle account-related issues.

**Acceptance Criteria:**

**Given** an active customer account,  
**When** the support employee blocks it,  
**Then** the system changes its status to Blocked.

**Given** a blocked customer account,  
**When** the support employee unblocks it,  
**Then** the system changes its status back to Active.

#### US-29: Request a Refund (FR-27)　 **Could**

As a customer, I want to request a refund for a completed payment, so that I can recover money when needed.

**Acceptance Criteria:**

**Given** a completed payment,  
**When** the customer requests a refund,  
**Then** the system creates a refund request.

#### US-31: Review and Approve Refund (FR-27)　 **Could**

As a support employee, I want to review and approve refund requests, so that only valid refunds are paid back to customers.

**Acceptance Criteria:**

**Given** a pending refund request,  
**When** the support employee approves it,  
**Then** the system refunds the amount to the customer's wallet and records a ledger entry.

### 2. Biller Catalog

Billers, services, required input fields, minimum and maximum amounts, and active or disabled status.

#### US-08: Manage Billers (FR-6)　 **Must**

As an admin, I want to add, edit, and disable billers, so that I can manage available payment services.

**Acceptance Criteria:**

**Given** an authorized admin,  
**When** they add or edit a biller,  
**Then** the system saves the changes.

#### US-09: View Billers and Services (FR-7)　 **Must**

As a customer, I want to see available billers and services, so that I can choose the service I need.

**Acceptance Criteria:**

**Given** available billers and services,  
**When** the customer opens the billers page,  
**Then** the system displays the billers and their required input fields.

### 3. Payment Processing

Payment life cycle, idempotency, and orchestration of payment steps in section 2.2 (bill inquiry, fraud checks, payment, and agent payments). Also covers payment search and daily statistics.

#### US-10: Bill Inquiry (FR-8)　 **Must**

As a customer, I want to check my bill before paying, so that I know the amount I need to pay.

**Acceptance Criteria:**

**Given** valid bill information,  
**When** the customer requests a bill inquiry,  
**Then** the system displays the bill amount, fee, and total.

#### US-11: Pay Bill (FR-9)　 **Must**

As a customer, I want to pay a bill using my wallet, so that I can complete my payments.

**Acceptance Criteria:**

**Given** a sufficient available wallet balance,  
**When** the customer confirms the payment,  
**Then** the system processes the payment.

#### US-12: Prevent Duplicate Requests (FR-10)　 **Must**

As a customer, I want to avoid duplicate payments, so that I am not charged more than once.

**Acceptance Criteria:**

**Given** a previously processed request with an idempotency key,  
**When** the same key is used again,  
**Then** the system returns the original result without processing another payment.

#### US-13: Payment Life Cycle (FR-11)　 **Must**

As a system, I want to control payment status transitions, so that payments follow the defined life cycle.

**Acceptance Criteria:**

**Given** a payment with a current status,  
**When** a valid status transition is requested,  
**Then** the system updates the payment status.

#### US-15: Handle Unknown Payments (FR-13)　 **Must**

As a system, I want to handle payment timeouts, so that uncertain payments can be checked again.

**Acceptance Criteria:**

**Given** a payment request that times out without a confirmed result,  
**When** the timeout is detected,  
**Then** the system changes the payment status to Unknown.

#### US-19: Agent Payment on Behalf of Customer (FR-17)　 **Should**

As an agent, I want to pay bills on behalf of customers, so that customers can use my services.

**Acceptance Criteria:**

**Given** a customer requesting bill payment through an agent,  
**When** the agent submits the payment,  
**Then** the system processes the payment on behalf of the customer.

#### US-20: Enforce Payment Limits (FR-18)　 **Must**

As a system, I want to enforce single-payment and daily limits, so that customers cannot exceed their allowed limits.

**Acceptance Criteria:**

**Given** a payment amount above the single-payment limit,  
**When** the customer submits it,  
**Then** the system rejects the payment and displays a clear reason.

**Given** a payment that would exceed the daily limit,  
**When** the customer submits it,  
**Then** the system rejects the payment and displays a clear reason.

#### US-21: Block Frequent Payments (FR-19)　 **Should**

As a system, I want to block accounts that make too many payments in a short time, so that suspicious activity can be prevented.

**Acceptance Criteria:**

**Given** an account that makes more than 5 payments within 60 seconds,  
**When** the limit is exceeded,  
**Then** the system blocks the account for 10 minutes.

#### US-22: Search Payment Details (FR-20)　 **Must**

As a support employee, I want to search for a payment using its reference, so that I can view its complete history.

**Acceptance Criteria:**

**Given** a valid payment reference,  
**When** the support employee searches for it,  
**Then** the system displays the payment details and full history.

#### US-27: Audit Log (FR-25)　 **Must**

As a system, I want to record all money movements and admin actions, so that activities can be tracked and reviewed.

**Acceptance Criteria:**

**Given** a money movement or admin action,  
**When** it occurs,  
**Then** the system creates an audit log entry.

#### US-30: View Daily Statistics (FR-28)　 **Could**

As an admin, I want to view daily payment statistics, so that I can monitor system performance and revenue.

**Acceptance Criteria:**

**Given** available daily transaction data,  
**When** the admin opens the dashboard,  
**Then** the system displays total payments, fees earned, commissions paid, and failures per biller.

### 4. Biller Integration

One adapter per biller that hides its protocol, timeout, retry, and callback handling. Also covers the daily reconciliation with biller settlement files.

#### US-16: Receive Payment Callbacks (FR-14)　 **Must**

As a system, I want to receive asynchronous callbacks from TopUpNet, so that payment statuses can be updated automatically.

**Acceptance Criteria:**

**Given** a valid callback from TopUpNet,  
**When** the system receives it,  
**Then** it processes the callback and updates the payment status.

**Given** a duplicate callback,  
**When** the system receives it,  
**Then** it ignores the duplicate.

#### US-17: Support Multiple Billers (FR-15)　 **Must**

As a customer, I want to pay through different billers, so that I can use different payment services.

**Acceptance Criteria:**

**Given** ElectroCo, AquaCo, and TopUpNet are configured,  
**When** customers use their services,  
**Then** the system supports each biller's required format.

#### US-28: Daily Reconciliation Report (FR-26)　 **Should**

As a system, I want to generate a daily reconciliation report from a settlement file, so that payment records can be compared with settlement data.

**Acceptance Criteria:**

**Given** a valid settlement file received from a biller,  
**When** the nightly reconciliation process runs,  
**Then** the system generates a daily reconciliation report listing any differences.

### 5. Fees and Commissions

Fee calculation (fixed, percentage, tiered, promotion) and agent commission. Also covers editing fee and limit values.

#### US-18: Calculate Payment Fees (FR-16)　 **Must**

As a system, I want to calculate fees according to the defined rules, so that customers are charged the correct amount.

**Acceptance Criteria:**

**Given** a payment request,  
**When** the system calculates the fee,  
**Then** it applies the rules defined in section 2.6.

#### US-32: Agent Commission (FR-17)　 **Should**

As an agent, I want to earn a commission on payments I make on behalf of customers, so that I am rewarded for my service.

**Acceptance Criteria:**

**Given** a confirmed payment submitted by an agent,  
**When** the payment is completed,  
**Then** the system calculates and records the agent's commission.

#### US-26: Update Fees and Limits (FR-24)　 **Should**

As an admin, I want to edit fee and limit values, so that I can update system rules without redeploying the application.

**Acceptance Criteria:**

**Given** an authorized admin,  
**When** they update a fee or limit value,  
**Then** the system saves the new value.

### 6. Notifications

SMS, email, and push messages with retry and message templates.

#### US-24: Send Payment Notifications (FR-22)　 **Must**

As a customer, I want to receive SMS and push notifications, so that I know whether my payment succeeded or failed.

**Acceptance Criteria:**

**Given** a completed payment,  
**When** its status is updated,  
**Then** the system sends an SMS and push notification to the customer.

#### US-25: Retry Failed Notifications (FR-23)　 **Should**

As a system, I want to retry failed notifications, so that customers have another chance to receive them.

**Acceptance Criteria:**

**Given** a notification that failed to deliver,  
**When** a delivery attempt fails,  
**Then** the system retries sending it up to 3 times and marks it undelivered if all attempts fail.

## 5. Business rules and configuration

Store fees, limits, fraud thresholds, timeouts and retry rules in configuration. All monetary amounts are in Egyptian pounds (EGP). Use exact decimal arithmetic for every monetary value.

| Rule | Phase 1 value |
| --- | --- |
| Daily payment limit | Basic account: 5,000 EGP. Verified account: 30,000 EGP. |
| Single payment | Minimum 5 EGP. Maximum 10,000 EGP. Both endpoints are within the allowed range. |
| Electricity and water | Fixed fee of 2.50 EGP per payment. |
| Mobile top-up | Fee is 1.5% of the amount, with a minimum fee of 1 EGP. |
| Internet | Fee is 2 EGP for amounts up to and including 200 EGP, and 4 EGP above 200 EGP. |
| Promotion | Zero fee for one selected biller during its configured start and end dates. |
| Agent commission | Credit 40% of the service fee to the agent’s wallet when the agent payment completes. A waived fee yields zero commission. |
| Velocity | More than five payments from one account in 60 seconds triggers a 10-minute block. |
| Live biller timeout | After 10 seconds without a confirmed result, mark the payment Unknown and retain the hold. |
| Unknown payment | Re-query up to three times, after 1, 5 and 15 minutes. If unresolved, await reconciliation. |
| Notification delivery | Retry failed deliveries up to three times before marking them undelivered. Brief §2.6 explicitly names SMS and email. FR-22 requires SMS and push for payment outcomes. |

## 6. Biller protocols and payment states

Use one adapter per biller to handle its protocol, timeouts, retries and callbacks. A protocol change such as ElectroCo v2 should require changes only to that integration.

| Biller | Integration | Scope |
| --- | --- | --- |
| ElectroCo | Fast, synchronous REST/JSON response | Required |
| AquaCo | Slow XML response | Required |
| TopUpNet | Immediate acceptance followed by an asynchronous callback indicating the outcome | Required |
| NetCo | Daily CSV batch file | Optional |

The existing PayLink requirements draft supplies the following transition details for FR-11. A payment in Unknown keeps its funds held until the outcome is established. A support-approved refund on a completed payment is a separate refund request under US-29 and US-31.

| Current state | Event | Next state |
| --- | --- | --- |
| Initiated | Fraud checks pass and the wallet reserves sufficient funds | FundsHeld |
| Initiated | Fraud checks fail or funds are insufficient | Rejected |
| FundsHeld | PayLink sends the request to the biller | SentToBiller |
| SentToBiller | Biller confirms success | Completed |
| SentToBiller | Biller refuses payment | Failed |
| SentToBiller | Biller times out with no confirmed result | Unknown |
| Unknown | Callback, status check or settlement confirms success | Completed |
| Unknown | Biller confirms refusal or reconciliation establishes that it never received the payment | Failed |
| Failed | PayLink releases the held funds | Refunded |

## 7. Non-functional requirements and verification

These are acceptance targets. Record measurements when the tests run.

| ID | Quality | Verification | Acceptance target |
| --- | --- | --- | --- |
| NFR-1 | Financial correctness | Submit the same payment concurrently. Also submit distinct payments competing for the same wallet funds. Inspect the ledger and balances. | Zero duplicate charges and zero negative available or held balances. |
| NFR-2 | Performance | Run payments against mock billers for 60 seconds and count processed payments each second. | Sustain 100 payments per second for one minute, processing 6,000 payments. |
| NFR-3 | Resilience | Stop one mock biller and submit valid payments to the remaining healthy billers. | 100% of those payments succeed. |
| NFR-4 | Modifiability | Add a biller and review the changed files. | Changes are confined to Biller Integration and configuration. |
| NFR-5 | Auditability | Exercise deposits, payments and refunds, then match each movement to its audit entry. | 100% of money movements record who acted and when. FR-25 also requires an entry for every admin action. |
| NFR-6 | Testability | Run automated domain tests and measure line coverage in GitHub Actions. | Domain logic has at least 70% line coverage in CI. |

