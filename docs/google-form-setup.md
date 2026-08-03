# Create the SEO owner Google Form

The script at `scripts/create-seo-owner-google-form.gs` creates:

- A published Google Form titled **A&D Home Care + Aging with Grace AFH — SEO Owner Information**
- Ten organized sections covering both homes
- An in-form summary of the claims and technical elements removed or narrowed during cleanup
- Required care-capability grids for A&D Home Care and Aging with Grace AFH
- A linked Google Sheet for responses
- A `Form links` worksheet containing the editor, respondent, and response-sheet URLs

It does not request or store passwords.

## Run it once

1. Sign in to the Google account that should own the form.
2. Open [Google Apps Script](https://script.google.com/) and create a **New project**.
3. Replace the starter code with the complete contents of
   `scripts/create-seo-owner-google-form.gs`.
4. Save the project as `AFH SEO Owner Form`.
5. Select `createSeoOwnerGoogleForm` in the function menu and click **Run**.
6. Review and approve the requested Google Forms and Google Sheets permissions.
7. Open **Execution log** at the bottom of the editor. It prints:
   - Form editor URL
   - Form respondent URL
   - Response spreadsheet URL
8. Open the form editor and review **Settings** before sending it. Google Workspace domain
   policies can change who is allowed to respond even when the script publishes the form.
9. Submit one test response and confirm it appears in the linked spreadsheet.

Running `createSeoOwnerGoogleForm` again from the same Apps Script project does not create a
duplicate; it prints the existing links. To intentionally create a new copy, first run
`allowCreatingAnotherSeoOwnerForm`. That helper clears only the saved IDs and does not delete the
existing Google Form or spreadsheet.

## Form design

The form is intentionally thorough but completion-friendly:

1. Respondent information
2. A&D contact, hours, capacity, and availability
3. Aging with Grace contact, hours, capacity, and availability
4. A&D care-capability grid and conditions
5. Aging with Grace care-capability grid and conditions
6. A&D Medicaid and payment policy
7. Aging with Grace Medicaid and payment policy
8. Legal identity, ownership, team credentials, and signage
9. Optional content for the next SEO phase
10. Account status, external records, and final notes

Unknown answers are supported. Account questions explicitly instruct respondents to use platform
invitations rather than entering credentials.
