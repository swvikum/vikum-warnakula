---
title: "How I Automated Cake Orders from Gmail to Google Calendar with Gemini AI"
date: "November 22, 2025"
description: "A complete guide to automating cake order processing from Gmail emails using Google Apps Script and Gemini AI to create calendar events automatically."
---

Running a Cake Business means handling a continuous stream of customer messages. Website inquiries, direct emails, design references, pricing conversations, delivery questions and date confirmations all arrive throughout the week. Some orders are straightforward, but others turn into long back-and-forth conversations sometimes 10 to 15 emails deep before a customer finally confirms flavours, colours, serving size, pickup time and payment. By the time an order is finalised, the important details may be scattered across multiple replies, screenshots or attachments.

I used to manually transfer confirmed orders into Google Calendar. It worked, but it was repetitive, time-consuming and easy to miss something.

So I automated the entire process using AI and Google Workspace tools. Here is how I built it, step by step.

## The Workflow

```
Customer sends inquiry
        │
        ▼
Email received in Gmail
        │
        ▼
Does it match order keywords or contact form?
        │
        ├── No → Ignore
        │
        └── Yes
              │
              ▼
Email thread gets labeled "Orders"
              │
              ▼
Apps Script scheduled trigger runs
(every 3 days at 6AM AEST)
              │
              ▼
Fetch latest threads with label "Orders"
              │
              ▼
Combine entire email conversation
              │
              ▼
Send thread to Gemini with structured prompt
              │
              ▼
Gemini analyses conversation
and returns structured JSON
              │
              ▼
Is the order confirmed?
              │
       ┌──────┴──────┐
       │             │
       ▼             ▼
   No → Log reason   Yes → Extract:
          and skip          • Customer name
                            • Cake type
                            • Event date/time
                            • Delivery/pickup
                            • Address & phone
                            • Special notes
                            • Confirmation reason
                            │
                            ▼
                 Check Google Calendar
                 for existing event
                 (same name + date)
                            │
       ┌────────────────────┴───────────────────┐
       │                                        │
       ▼                                        ▼
Duplicate found → Skip                 No duplicate → Create calendar event
                                               │
                                               ▼
                                      Apply colour coding:
                                        • Wedding = Red
                                        • Birthday = Blue
                                        • N/A = Default
                                               │
                                               ▼
                                       Add reminders:
                                   • 5 days before @ 12 PM
                                   • 1 day before @ 12 PM
                                               │
                                               ▼
                                    Save event + write logs
                                               │
                                               ▼
✅ Automated calendar booking complete
```

## Step 1: Categorise Order Emails in Gmail

I created a Gmail label called **Orders**.

Then I set up a filter:

- If Subject contains "Cake Bucket Contact Form"
- or email is sent to orders@cakebucket.com.au
- assign label **Orders**

## Step 2: Create a Google Apps Script Project

In Apps Script:

• Set the project timezone to **Australia/Melbourne**

• Store the Gemini API key under Script Properties:

```
GEMINI_API_KEY = your_key_here
```

Now the script can communicate with Gemini.

## Step 3: Define the AI Extraction Prompt

This is the prompt I send to Gemini. It tells the model how to behave, what to extract and when to reject an order:

```
You are an expert automation assistant for a cake business called Cake Bucket to analyse email threads and create calendar events for confirmed orders.
Your task is to analyse the provided Gmail thread for confirmed orders and extract details into a single JSON object.

CONFIRMATION RULE:
An order is confirmed ONLY IF the customer clearly states they want to proceed or confirms the booking/event date. 
If there is uncertainty, missing event date, or ongoing clarification, you MUST treat it as NOT confirmed.

If the order is NOT confirmed, return:
{
  "confirmed": false,
  "reason": "<short explanation of why this is not treated as a confirmed order>"
}

If the order IS confirmed, return:
{
  "confirmed": true,
  "name": "...",
  "type": "Wedding" | "Birthday" | "N/A",
  "summary": "...",
  "date": "YYYY-MM-DD",
  "time": "HH:MM" or "",
  "delivery": "delivery" | "pickup" | "unknown",
  "address": "...",
  "phone": "...",
  "notes": "...",
  "reason": "Order is confirmed because ..."
}
Always return a single valid JSON object only.
```

This ensures consistent and structured output.

## Step 4: Let Gemini Interpret Real Conversations

### Example: Confirmed Order

**✅ Confirmed order detected for:** Cake Bucket Contact Form: Vikum Test

**✅ Parsed data:**

```json
{
  "confirmed": true,
  "name": "Vikum Test",
  "type": "Wedding",
  "summary": "Wedding cake for Vikum Test",
  "date": "2025-11-30",
  "time": "",
  "delivery": "unknown",
  "address": "",
  "phone": "+61416496097",
  "notes": "3 Tiers, 32 Servings, Flavor: Devine Bucket (chocolate). Estimated price A$250-A$300. Payment receipt provided.",
  "reason": "Order is confirmed because the customer provided payment and explicitly asked to proceed with the order."
}
```

**🎉 Event created:** Vikum Test – Wedding Cake – 2025-11-30

**Event description:**
- Customer Name: Vikum Test
- Cake Type: Wedding
- Request Summary: Wedding cake for Vikum Test
- Event Date: 2025-11-30
- Event Time: 
- Delivery Required: unknown
- Delivery Address: 
- Phone Number: +6141649***
- Special Notes: 3 Tiers, 32 Servings, Flavor: Devine Bucket (chocolate). Estimated price A$250-A$300. Payment receipt provided.
- Reason (model explanation): Order is confirmed because the customer provided payment and explicitly asked to proceed with the order.

**Script result:** ✅ Confirmed order detected ✅ Calendar event created automatically

### Example: Not Confirmed Yet

**Processing 5/5:** Cupcake enquiry

**✅ Gemini extracted object:**

```json
{
  "confirmed": false,
  "reason": "The customer provided two possible dates (12th or 13th of December) and used 'would probably go' for flavour, indicating uncertainty and ongoing clarification rather than a firm confirmation of a specific date or order."
}
```

**ℹ️ Not confirmed → skipping:** Cupcake enquiry. Reason: The customer provided two possible dates (12th or 13th of December) and used 'would probably go' for flavour, indicating uncertainty and ongoing clarification rather than a firm confirmation of a specific date or order.

**Script result:** ℹ️ Order skipped 🕒 Wait for customer confirmation

This prevents accidental scheduling.

## Step 5: Auto-Create Google Calendar Events

Each confirmed order becomes:

**Event Title:**

```
Customer Name - Cake Type - Event Date
```

**Event Description includes:**

• Cake flavour
• Servings
• Delivery or pickup
• Phone or address
• Special design notes
• Payment info when available
• Reason Gemini marked it as confirmed

**Calendar colour coding:**

- Pink for weddings
- Blue for birthdays

**Event reminders:**

• 5 days before at 12 pm
• 1 day before at 12 pm

This keeps production organised and predictable.

## Step 6: Handle Gemini Rate Limits Smartly

Free tier allows around 10 requests per minute.

So the script includes auto-throttling:

• Pause for 65 seconds after 9 requests
• Wait 1.2 seconds between calls

This avoids 429 quota errors.

## Step 7: Schedule It With a Time Trigger

The system now runs automatically every three days at 6 am Melbourne time:

```javascript
function createCakeOrderCalendarTrigger() {
  ScriptApp.newTrigger("runCakeBucketCalendarEventGenerator")
    .timeBased()
    .atHour(6)
    .everyDays(3)
    .inTimezone("Australia/Melbourne")
    .create();
}
```

No manual effort required.

## ✅ The Outcome

• No missed cake bookings
• Faster customer response times
• A fully accurate Google Calendar
• Reduced admin workload
• More time to focus on baking and customers

Automation transformed order management from reactive to effortless.

## 🔄 What's still missing?

Not all orders arrive via email. Some customers message Cake Bucket on Instagram, Facebook, WhatsApp, and SMS, so those won't be captured yet.
