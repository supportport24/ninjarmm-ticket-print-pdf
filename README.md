NinjaRMM Unofficial Print & PDF v1.0
Chrome Extension that adds Print and PDF export buttons to NinjaRMM tickets with automated time calculation.

# NinjaRMM Unofficial Print & PDF Extension

A lightweight Chrome Extension for NinjaOne (NinjaRMM) that adds **Print** and **PDF** export functionality directly to the ticketing interface.

## Features
* **One-Click PDF:** Generates a professional PDF of the ticket including Subject, Ticket ID, and Organization.
* **Work Log Summary:** Automatically scrapes and formats the activity log.
* **Time Calculation:** Totals all hours and minutes recorded in the ticket for a quick "Total Time" summary.
* **CSP Compliant:** Built to bypass strict Content Security Policies using an external worker architecture.

## Installation (Manual/Developer Mode)
Until this is on the Web Store, you can install it manually:

1. **Download** this repository as a ZIP and extract it to a folder.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top right).
4. Click **Load unpacked** and select the folder containing the extension files.
5. Refresh your NinjaRMM tab.

## Why use this?
NinjaRMM's native printing can often be clunky or include unnecessary UI elements. This extension scrapes only the relevant ticket data and formats it into a clean, client-ready document.

## Credits
Uses the [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) library.
