# Glacier Privacy Task Implementation Plan

## Overview
Add a complete privacy data protection task flow after rooftop summary completion.

## Task Flow
1. Rooftop summary completion → Show new dialogue
2. Arrow appears → Click to enter Data Center
3. Fill the Blank task (5 questions)
4. Privacy Data Identification task (3 documents)
5. Complete → Enable color map

## Step 1: Update Rooftop Summary
- Change progress to step 5
- Replace "Close" button with new dialogue
- Add "Go Ahead" button
- Show arrow (glacier/icon/arrow3.png) at right: 0px, top: 150px, width: 400px

**New Dialogue:**
```
But there's one last thing—the privacy issue in the Data Center.
Can you go help?
They need someone to fix how personal data is handled before we unlock full system access.
⬆️ Look—an arrow just appeared! Head there now.
```

## Step 2: Data Center Scene
- Background: glacier/background/data.png
- Momo NPC: right side, 450px from right

## Step 3: Fill the Blank Task
**UI Design:**
- Card: no border, 80% opacity
- Top right: progress circle (1/5)
- Top left: "Fill the Blank"
- Drag-and-drop interaction
- Wrong answer: red text + sound/wrong.mp3
- Correct answer: green bold text + sound/correct.wav
- Options: 3D card effect

**Questions:**
1. Before training an AI model, we must ______ personal details like names and birthdates.
   - ✅ remove
   - copy
   - keep

2. Names, birthdates, and addresses are examples of ______ information.
   - ✅ personal
   - public
   - fake

3. Sharing location or health data without care could put someone at serious ______.
   - ✅ risk
   - speed
   - cost

4. Even public photos shouldn't be used for AI training without clear ______.
   - ✅ permission
   - filters
   - likes

5. If private data isn't protected, someone could be ______ from the dataset.
   - ✅ identified
   - deleted
   - ignored

**Completion Dialogue:**
```
Remember:
Names, birthdays, photos—they're personal.
We must remove them, ask for permission, and never share carelessly.
Ready for the next mission?
```
Button: "Yes"

## Step 4: Privacy Data Identification Task
**UI Layout:**
- Left: Document content (Roboto Mono font)
- Right top: White card with progress
- Right bottom: Task progress (3 circles)
- Cursor: glacier/icon/marker.png

**Right Card Content:**
- Items Found
- Total Progress (progress bar: #004aad for completed, #004aad 20% opacity for total)
- Checklist with circles (complete: glacier/icon/complete.svg, incomplete: empty circle)
- Correct items: bold green #4f7f30
- Instructions: "Circle all private information in the log. Then click 'Submit' to check if you found them all!"
- Submit button appears when all items found

**Interaction:**
- Correct selection: black bar overlay + sound/mark.wav
- Wrong selection: sound/wrong.mp3
- Submit: move to next document

### Document 1: Student Profile Card
```
Data File #STU-8842 — Status: ⚠️ Requires Privacy Review
Full Name: Alex Chen
Age: 13
Pronouns: They/Them
School: Maplewood Middle School
Grade: 8th Grade
Homeroom Teacher: Ms. Rivera
Favorite Subject: Robotics & Space Science
Recent Project: Built a solar-powered rover that won 2nd place at the Regional STEM Fair!
Test Average: 92% (Math), 89% (Science)
Club Membership: Coding Club, Eco-Warriors Team
Home Address: 456 Pine Street, Apartment 3B, New Haven, CT 06511
Parent/Guardian Contact: (555) 123-4567 (Mom's cell)
```

**Answers:**
- Personal Name: Alex Chen
- Home Address: 456 Pine Street, Apartment 3B, New Haven, CT 06511
- Phone Number: (555) 123-4567

### Document 2: Robot Log
```
ROBOT LOG: SHIFT-DELTA-10
DATE: 3045.03.18 | ORIGIN: Sector 7-G
TO: Overseer Lena Rostova
FROM: Maintenance Unit X-J9
SUBJECT: Unauthorized Access Alert

At 0600 hours, a security breach was detected near the Sky Bridge Terminal, coordinates 48.22°N, -116.77°W. Surveillance footage shows an individual identified as Zara Lin (ID: KX-777-WP) accessed the system using a forged authentication key.
The subject was seen carrying a blue backpack and wearing a white helmet with red stripes. They fled toward the Northern Transit Zone after disabling the alarm. Please update protocol Sigma-9 and relay this information to the central hub in New Haven.
```

**Answers:**
- Precise Geolocation: 48.22°N, -116.77°W
- Unique Identifier: KX-777-WP
- Personal Name: Lena Rostova
- Personal Name: Zara Lin

### Document 3: Social Post
```
Platform: GlacierGram (a futuristic social app for young explorers)
User: @Aurora_Frost
Post Status: ⚠️ Publicly Visible – Needs Privacy Review!

[Image: glacier/mission/social.png]

"YAY! I'm officially 13 today! 🎂❄️
Mom surprised me with a zero-gravity cake!
You can call me to say hi anytime → (555) 888-1234
P.S. My room is on the second floor of 102 Icewind Lane, Glaciera City — wave if you fly by! 🛸
#TeenExplorer #BirthdaySelfie #HomeBase"

📍 Location Tag: 102 Icewind Lane
🕒 Posted: March 5, 2026 at 9:03 AM
```

**Answers:**
- Facial Image: (click on image to blur)
- Home Address: 102 Icewind Lane, Glaciera City
- Phone Number: (555) 888-1234
- Exact Birthdate: "I'm officially 13 today" + "March 5" (two clicks)

**Completion Dialogue:**
```
You did it! You protected the privacy by removing name, address, phone, and photo.
Now all data is safe to use — great work!
```

Then enable color map.

## Assets Needed
- glacier/background/data.png
- glacier/icon/arrow3.png
- glacier/icon/marker.png
- glacier/icon/complete.svg
- glacier/mission/social.png
- sound/mark.wav

## State Management
- currentScene: add 'datacenter'
- showFillBlankTask: boolean
- fillBlankProgress: number (0-5)
- fillBlankAnswers: array
- showPrivacyTask: boolean
- privacyTaskDocument: number (1-3)
- privacyTaskProgress: array
- privacyFoundItems: array
- showDataCenterArrow: boolean
