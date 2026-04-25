---
title: Opening
css: styles/opening.css
date: April 11, 2026
author: Munus Shih
---

```p5.js

let x, y;
let vx, vy;
let ew = 120;
let eh = 60;
let col;

p.setup = () => {
p.createCanvas(400, 300);
x = p.width / 2;
y = p.height / 2;

vx = p.random(1, 2) * (p.random() < 0.5 ? -1 : 1);
vy = p.random(1, 2) * (p.random() < 0.5 ? -1 : 1);

p.textAlign(p.CENTER, p.CENTER);
p.textSize(20);

col = p.color(255);
};

p.draw = () => {
p.clear();

x += vx;
y += vy;

let bounced = false;

if (x < ew / 2 || x > p.width - ew / 2) {
    vx *= -1;
    vy += p.random(-0.3, 0.3);
    bounced = true;
}

if (y < eh / 2 || y > p.height - eh / 2) {
    vy *= -1;
    vx += p.random(-0.3, 0.3);
    bounced = true;
}

if (bounced) {
    col = p.color(p.random(255), p.random(255), p.random(255));
}

p.fill(col);
p.ellipse(x, y, ew, eh);

p.textSize(32);
p.fill(0);
p.text("DVD", x, y);
};

```

- Participants: Munus Shih, Aarushi Bapna, Avneesh Sarwate, Tanvi Sharma, Matt Martin, Arden Schager, Matias Piña Aguilera
- April 11, Saturday, 2:00–4:30pm
- Steuben Hall (Juliana Curran Terian Design Center), 4th floor. Big open conference room.

---

## Agenda

- **2:00** — [Introduction & settling in](#welcome) _(15 min)_
- **2:15** — [Ice breaking & pop-corn introductions](#welcome) _(15 min)_
- **2:30** — [Mapping interests](#mapping) _(30 min)_
- **3:00** — [Co-create infrastructure & format](#infrastructure) _(30 min)_
- **3:30** — [Identify offers & requests](#offers) _(30 min)_
- **4:00** — Schedule next meeting, mingle, goodbye _(30 min)_

---

## Welcome

1. Hi everyone!
2. Let's start with a [group meditation](https://youtu.be/wE292vsJcBY?si=GFKEnlFbI-oKLZb-) to ground ourselves before we get started.
3. Let's go around and share our names (how to pronounce them correctly!), our pronouns, where we call home. When the last time you used AI? And anything else you want to share about yourself.

---

## Ice-breaking

We will be doing a lot of discussions and writing today. To get us warmed up, let's put together [a playlist](https://open.spotify.com/playlist/1XgZ1Qry5bFx5LtYvtvlAp?si=f2cab8feab4a40af&pt=acf320118ff5d1c52e0696c0e13dd8a1) with our favorite songs - no rules, just songs that you love. We will play this in the background while we work. Feel free to add songs throughout the session as well.

## Why we're here?

[This is](./#index) a monologue that I wrote to share my thoughts and feelings about AI, and to set the tone for our first session. I will read it out loud, but you can also read it here if you want.

## Free writing

Let's take about 5-8 minutes to write down our thoughts about AI. You can write about anything you want, but here are some prompts to get you started:

- What is on your mind about AI right now?
- Why did you want to join this group?
- What are you hoping to get out of it?
- What are you worried about?

We will read these our loud later! Don't worry about grammar, spelling, or anything like that. Just write whatever comes to your mind. This is a safe space, and we will not judge each other for what we write.

Like a manifesto!

---

## What is the structure of this group?

Critical AI Potluck is a peer-led learning group. We will meet regularly to learn together about AI, to share our work, to support each other, and to imagine alternatives. We will decide the format and structure together, there is no fixed agenda (except today) or curriculum. We will create it together, as we go.

Inspired by [Trade School](https://tradeschool.coop/): barter-based, peer-led, no experts.

The name "potluck" is a nod to the idea of bringing something to share, whether it's knowledge, a project, a question, or even just your presence. It's also a reminder that this is meant to be a casual, welcoming space where we can all contribute in our own way.

---

## Mapping

We'll use a shared board to map everything we're curious about, worried about, or already know around AI.

Possible prompts — add yours:

- What are you curious about? (maybe something you want to learn, or a question you have, or something you want to explore together, etc.)
- What are you worried about? (maybe a concern you have, or something you want to be careful about, etc.)
- What do you already know? (maybe something you can teach, or a project you're working on, or something you want to share, etc.)

Let's take about 5-8 minutes to write down our thoughts individually. Then we will break into a group of 2-3 to discuss, and then share the ones we like with the whole group, and map them together to see if there are recurring themes or clusters.

Let's discuss!

---

## Infrastructure

What does this group need to function well?

We will decide these things together. Think about the following questions here, and write them down first individually. Then we will break into a group of 2-3 to discuss, and then share with the whole group.

| Question                                             | Options                                      |
| ---------------------------------------------------- | -------------------------------------------- |
| How often do we meet?                                | Monthly                                      |
| How long?                                            | 2.5h                                         |
| Where?                                               | Rotating                                     |
| How do we share notes?                               | This site                                    |
| How do we want to make decisions?                    | Consensus                                    |
| How do we want to communicate between sessions?      | iMessage                                     |
| How do we want to document our work?                 | This site / Are.na                           |
| How do we want to share our work outside the group?  | TBD / Closing Gathering                      |
| How do we want to handle disagreements or conflicts? | Agree to Disagree / Community Agreement      |
| How do we want to invite new members?                | Referral (Verbal / Text Notice)              |
| How to create a welcoming and inclusive environment? | Community Agreement                          |
| How to credit the use of AI in our work?             | Acknowledgment (Transparency vs Performance) |
| What else do we need to better learn together?       |                                              |

Anything else?

---

## Offers

Each person can offer to teach something and/or request to learn something. These become future sessions.

| Name            | I want to facilitate            |
| --------------- | ------------------------------- |
| Matt            | Local / Slow / Low Tech AI      |
| Tanvi + Aarushi | Critical + Ethical AI           |
| Tanvi + Aarushi | Critical + Ethical AI           |
| Matias + Arden  | Ethical Creative Techniques     |
| Matias + Arden  | Ethical Creative Techniques     |
| Munus           | Friction in Pedagogy            |
| Avneesh         | Structure (Historical Analysis) |

What kind of format could this take? A workshop? A presentation? A discussion? Panel Discussion? Round Table? Something else?
Where do we want to meet for these sessions? In person? Online? Hybrid?
What else do we need to make these sessions happen?

## Overarching themes

- green + ecology
- shared reading / library for conversations
- speculative dataset that we can share
- everything from a Non-US-centric perspective

---

## Next steps

Let's schedule our next meeting. We can decide on the date and time that works best for everyone. We can also start thinking about what we want to focus on for our next session, based on the offers and requests we just shared.

- Flexible time for us to build something or start any other initiative.
- For instance, I will love if someone can make this CSS better.
- Or if someone wants to offer a prettier domain name.

Next time: 5/9 Saturday 2:00–4:30pm @ NEW INC??? - Munus Shih

## This repository

We will use this repository as a shared writing space. Each person contributes a markdown.
