---
title: "How I Reduced Missed Orders by Automating SMS → Calendar with Gemini AI"
date: "February 10, 2026"
description: "A complete guide to automating SMS order processing using iPhone Shortcuts, Google Apps Script, Gemini AI, and Google Calendar to eliminate missed bookings."
---

If you run a small business, you know this pain:

Customers text you an order… You reply… They confirm… Then you still need to manually create a calendar event.

And that's where mistakes happen:

* you forget to add it
* you add the wrong date
* you miss delivery details
* you lose the thread when multiple customers message at once

So I built a system that does this automatically:

✅ Customer SMS → stored as a thread → AI confirms order → calendar event created …with a daily 6AM automation.

![SMS to Calendar Automation](/article-images/smstocalendar.png)

## The Workflow (High Level)

```
Customer SMS
   ↓
iPhone Shortcut Automation (on new message)
   ↓
Google Apps Script Webhook (doPost)
   ↓
Google Sheet (store thread per phone number)
   ↓
Daily 6AM trigger
   ↓
Gemini AI (confirm + extract details)
   ↓
Google Calendar event created
   ↓
Sheet status updated to confirmed
```

## Why not use n8n / Make / Zapier?

Tools like n8n and Make.com are great — but for a small business, cost grows quickly when you scale messages.

* Make uses a credit / operation-based model (their Free plan exists, but usage is limited; paid tiers scale by operations).
* n8n Cloud has execution limits per plan, and self-hosting is "free" but requires hosting + maintenance.

I wanted something:

* close to $0 to run
* fully under my control
* simple + reliable

So I built it using Google Apps Script + Google Sheet + Gemini + Calendar.

## The Key Challenge: SMS Threads are messy

SMS order conversations are not structured like a form.

Example thread:

```
Customer: Hi, I need a cake for my son.
Business: Sure! What date do you need it for?

Customer: Maybe next Saturday.
Business: No worries 😊 How many people will it serve?

Customer: Around 12.
Business: Great. Do you need delivery or pickup?

Customer: How much is delivery?
Business: Delivery is $15 within 10km. The total for the cake will be $95 including delivery.

Customer: Ok confirmed. I'll pay now.
```

It's hard to know:

* Is this actually confirmed?
* What date did they confirm?
* Who is it for?
* Delivery or pickup?

This is where Gemini AI is perfect.

Gemini can:

✅ decide if the order is confirmed

✅ extract structured fields: name, date, time, delivery, notes

✅ return clean JSON for automation

So the automation doesn't "guess" — it makes an AI decision.

## Step-by-step: iPhone automation (Shortcut)

The iPhone part acts as the "SMS listener".

### 1) Create a Shortcut

* Open Shortcuts app
* Tap Automation
* Tap + → "Create Personal Automation"
* Choose Message
* Select: When I receive a message
* Optionally limit: only messages containing keywords like "cake", "order", "birthday", etc.

### 2) Add Action: Get contents of URL

* Add action: Get Contents of URL
* Method: POST
* URL: your Apps Script Web App URL

### 3) JSON Body to send

Send something like this:

```json
{
  "from": "{{Sender}}",
  "message": "{{Content}}"
}
```

## Step-by-step: Webhook + Deploy + Listening (Google Apps Script)

This is the core piece.

### 1) Create Apps Script project

* Go to Apps Script
* Create new project
* Paste your code

### 2) Deploy as Web App

* Deploy → New deployment
* Type: Web App
* Execute as: Me
* Who has access: Anyone

This gives you a URL like:

```
https://script.google.com/macros/s/.../exec
```

### 3) Confirm your webhook is receiving

You can verify it 3 ways:

✅ Apps Script executions

* Apps Script → Executions
* Click the latest doPost run
* You'll see logs + request content

✅ Sheet updates

* After webhook call, it writes/updates the thread row

✅ Test with curl/postman

Use curl to test anytime:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"from":"+61412345678","message":"Test order confirmed for 28 Feb birthday cake"}' \
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

## How thread storage works (Google Sheet)

The sheet keeps one row per customer phone number:

| phone | thread | status | lastUpdated | lastGeminiRun | geminiResult |
|-------|--------|--------|-------------|---------------|--------------|

Every incoming SMS:

* finds the row for that phone
* appends the message into the thread column
* updates timestamps

This keeps the full conversation in one place.

## Daily 6AM: Gemini → Calendar

Every morning at 6AM Melbourne time, the script runs:

### It scans the sheet and processes only:

✅ rows where status = open

Then it sends the thread to Gemini:

Gemini returns either:

**Not confirmed**

```json
{
  "confirmed": false,
  "reason": "Waiting for date confirmation"
}
```

**Confirmed**

```json
{
  "confirmed": true,
  "name": "Jensen",
  "type": "Birthday",
  "date": "2026-02-15",
  "delivery": "pickup",
  ...
}
```

Then the script:

✅ creates a Google Calendar event

✅ formats a clean description (not raw JSON)

✅ marks sheet status as confirmed so no duplicates

## Calendar creation

The calendar event title becomes something like:

```
Jensen – Birthday Cake – 2026-02-15
```

The description becomes:

* customer name
* cake type
* date/time
* delivery details
* notes
* and Gemini's reasoning (so you can audit decisions)

## 🔄 Full Automation: From SMS to Back Office System

To complete the loop, we also built a back-office application that runs a scheduled cron job.

Once the calendar event is created:

* The back-office service runs on a schedule
* It reads newly created events
* Syncs confirmed orders into the main database
* Updates internal order records
* Keeps reporting, production planning, and logistics aligned

## Why this matters (business impact)

This automation reduces:

✅ manual admin work

✅ missed bookings

✅ wrong dates

✅ forgetting to add orders

✅ context loss across threads
