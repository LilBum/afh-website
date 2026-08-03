# Room availability updates

The production website reads current room availability from a dedicated Google Form workflow.
The owner uses only a private, bookmarked form; routine updates do not require code, Git, or a
website deployment.

## What the owner does

1. Open the bookmarked **Update Room Availability — A&D + Aging with Grace** form.
2. Choose the home and its new status.
3. If a room is available, choose the room count, room type, and bathroom arrangement. Choose
   `Not applicable` for any detail that should not be advertised; the site will publish a safe,
   generic opening instead of guessing.
4. Confirm that the update contains no resident or applicant information, then submit.

Submit one response for each home during initial setup. After that, submit only for the home that
changed. A correction is a new submission; the newest authorized submission wins.

The public safeguards are automatic:

- `Available` expires after 7 days.
- `Waitlist`, `Full`, and an owner-confirmed `Call for current availability` expire after 30 days.
- Missing, invalid, expired, or unreachable data becomes `Call for current availability`.
- Every accepted owner update displays its confirmation date. An automatic fallback does not.
- The form never asks for resident names, diagnoses, occupancy, or contact information.

## One-time Google setup

This setup must be completed while signed into the Google account that should own the form and
response history. The site owner does not need access to the code repository.

1. Open [Google Apps Script](https://script.google.com/) and create a **New project**.
2. Replace the starter code with the complete contents of
   `scripts/create-availability-google-form.gs`.
3. Save the project as `AFH Availability Updates`.
4. Select `createAvailabilityGoogleForm` in the function menu and click **Run**.
5. Review and approve the requested Google Forms and Google Sheets permissions.
6. Open the execution log and copy the **Private owner update form** URL. Bookmark this URL on the
   owner's phone. It contains a prefilled authorization value, so do not publish it.
7. In Apps Script, choose **Deploy > New deployment > Web app**.
8. Set **Execute as** to `Me` and **Who has access** to `Anyone`, then deploy. The web app returns
   only the current public status; it never exposes the response sheet or authorization value.
   If `Anyone` is unavailable, the Google Workspace administrator has disabled public web apps;
   use an account that permits public web-app access or ask the administrator to allow it.
9. Run `logAvailabilityLinks` once more. Copy the **Availability JSON web app** URL ending in
   `/exec`; never use the editor-only `/dev` URL.
10. Open the `/exec` URL in a signed-out or private browser window. Continue only if it returns JSON
    with `schemaVersion: 1` and both `lynnwood` and `everett`. A sign-in page or permission error
    means the deployment access setting is not public.
11. Submit one initial update for A&D Home Care and one for Aging with Grace AFH.

Google documents both [linked Form response sheets](https://support.google.com/docs/answer/2917686)
and [JSON responses from Apps Script web apps](https://developers.google.com/apps-script/guides/content).

## One-time Cloudflare connection

Set the Apps Script `/exec` URL as the Worker's `AVAILABILITY_SOURCE_URL` runtime variable, then
deploy the Worker. Do not use the `/dev` test URL; it requires editor access and is not suitable
for the public site. `wrangler.jsonc` sets `keep_vars` so future Git deployments preserve this
dashboard-managed value.

After deployment, open `https://kingsgateafh.org/api/availability` in a signed-out browser and
confirm that it returns both homes, the submitted statuses, `confirmedAt`, and `expiresAt`. Also
check the website's availability cards. If the API response header `X-Availability-Source` is
`fallback`, the Worker could not use the Google feed and is deliberately showing the safe status.

The site calls only its same-origin `/api/availability` endpoint. The Worker follows Google's
Content Service redirect, validates the response, rechecks the expiration rules independently,
and caches valid data briefly. If Google or the feed is unavailable, the site shows the safe
call-for-availability fallback.

## Setup record

Store these links in the Google response spreadsheet's **Setup links** tab:

| Item | Value |
|---|---|
| Google account that owns the files | Created automatically when Google exposes it; otherwise record manually |
| Private bookmarked owner form | Created automatically |
| Form editor | Created automatically |
| Response spreadsheet | Created automatically |
| Apps Script `/exec` URL | Added after web-app deployment |
| Cloudflare variable configured | `AVAILABILITY_SOURCE_URL` |

The prefilled form URL is a bearer credential: anyone who has it can submit an update. Keep the
Form editor and response spreadsheet restricted to trusted Google accounts, share only the
prefilled responder bookmark with the owner, and never enable link-sharing on the spreadsheet.
Never put the private URL, its authorization value, Google credentials, or Cloudflare credentials
in the repository.

## Maintenance

- If the questions or Apps Script logic change, use **Deploy > Manage deployments**, edit the
  existing web-app deployment, choose **New version**, and deploy. Updating the existing deployment
  preserves its `/exec` URL; creating a separate deployment requires replacing
  `AVAILABILITY_SOURCE_URL` in Cloudflare.
- Do not rename form questions manually; the script reads their exact titles.
- Do not delete the **Setup links** tab or response form unless the workflow is intentionally being
  replaced.
- If the private form link is lost or exposed, run `rotateAvailabilityGoogleForm`. It creates and
  verifies a replacement, switches the live feed to the new authorization value, and closes the
  old form. Replace the owner's bookmark with the newly logged link. The prior Google files remain
  in Drive as an audit record and may be archived manually after verification.
- If a saved ID is incomplete or a Google file cannot be opened, do not clear Script Properties or
  rerun basic creation. Run `rotateAvailabilityGoogleForm`; ordinary setup functions stop on broken
  configuration instead of silently creating duplicates.
