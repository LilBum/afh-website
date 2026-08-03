const FORM_TITLE = 'A&D Home Care + Aging with Grace AFH — SEO Owner Information';
const RESPONSE_SHEET_TITLE = 'A&D + Aging with Grace — SEO Owner Responses';
const FORM_ID_PROPERTY = 'SEO_OWNER_FORM_ID';
const SHEET_ID_PROPERTY = 'SEO_OWNER_RESPONSE_SHEET_ID';

const SERVICE_ROWS = [
  'Medication reminders or assistance',
  'Medication administration or management',
  'Diabetes support excluding insulin',
  'Insulin assistance or administration',
  'Incontinence care',
  'Nurse-delegated care',
  'Wound care',
  'Oxygen therapy',
  'Tube feeding',
  'Stroke/CVA recovery support',
  'Foley catheter care',
  'Bowel/bladder retraining',
  'Cancer care',
  'Congestive heart failure care',
  'Support for residents enrolled in hospice',
  'Formal outside hospice partner relationship',
  'Doctor genuinely on call for residents',
  'Transportation provided by the home',
  'Hair stylist or nail services',
  'Exercise program',
  'Recreational music activities',
  'Clinical music therapy',
];

const SERVICE_COLUMNS = [
  'Yes — may publish',
  'No — do not publish',
  'Conditional — publish only with qualifications',
  'Not sure — needs verification',
];

const YES_NO_UNSURE = ['Yes', 'No', 'Unsure'];
const LEGACY_PHONE_STATUS = [
  'Active',
  'Forwards to another number',
  'Disconnected',
  'Wrong or no longer controlled',
  'Unsure',
];
const MEDICAID_STATUS = [
  'Yes — accepting now',
  'No',
  'Conditional or waitlist',
  'Unsure',
];

const HOMES = [
  {
    key: 'lynnwood',
    name: 'A&D Home Care',
    city: 'Lynnwood',
    address: '3111 201st Pl SW, Lynnwood, WA 98036',
    license: '750676',
    legacyPhones: ['(425) 673-0745'],
  },
  {
    key: 'everett',
    name: 'Aging with Grace AFH',
    city: 'Everett',
    address: '2825 132nd St SE, Everett, WA 98208',
    license: '753460',
    legacyPhones: ['(425) 357-8630', '(425) 225-5721'],
  },
];

/** Creates the Google Form and linked response spreadsheet once. */
function createSeoOwnerGoogleForm() {
  const existing = getExistingFiles_();
  if (existing) {
    logLinks_(existing.form, existing.spreadsheet);
    return;
  }

  const form = FormApp.create(FORM_TITLE, false)
    .setDescription(
      [
        'This form collects the facts needed to finish the SEO work for A&D Home Care and Aging with Grace AFH.',
        'Answer separately for each home. If something is unknown, choose “Unsure” or write “Unknown.”',
        'Do not enter passwords. Account access must be granted through each platform’s invitation feature.',
        'Addresses, license numbers, coordinates, Google profile URLs, and current website photos are already recorded.',
      ].join('\n\n'),
    )
    .setCollectEmail(false)
    .setProgressBar(true)
    .setAllowResponseEdits(true)
    .setShowLinkToRespondAgain(false)
    .setPublishingSummary(false)
    .setShuffleQuestions(false)
    .setConfirmationMessage(
      'Thank you. Your answers have been saved. Use the edit-response link if you need to add documents or correct anything later.',
    );

  addRespondentSection_(form);
  HOMES.forEach(function (home) {
    addBusinessFactsSection_(form, home);
  });
  HOMES.forEach(function (home) {
    addCareMatrixSection_(form, home);
  });
  HOMES.forEach(function (home) {
    addPaymentSection_(form, home);
  });
  addIdentitySection_(form);
  addContentSection_(form);
  addAccessSection_(form);

  const spreadsheet = SpreadsheetApp.create(RESPONSE_SHEET_TITLE);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  form.setPublished(true).setAcceptingResponses(true);

  writeLinksSheet_(spreadsheet, form);
  PropertiesService.getScriptProperties().setProperties({
    [FORM_ID_PROPERTY]: form.getId(),
    [SHEET_ID_PROPERTY]: spreadsheet.getId(),
  });
  logLinks_(form, spreadsheet);
}

function addRespondentSection_(form) {
  form.addSectionHeaderItem()
    .setTitle('About this response')
    .setHelpText('One person may complete the entire form, or the owners may collaborate on one response.');

  form.addSectionHeaderItem()
    .setTitle('What the current SEO cleanup removed or narrowed')
    .setHelpText(
      [
        'Until the facts below are confirmed separately for each home, the website no longer presents these as shared or unconditional claims:',
        '- wound care, oxygen therapy, tube feeding, stroke/CVA care, Foley catheter care, bowel/bladder retraining, cancer care, congestive-heart-failure care, hospice care, or a home doctor on call',
        '- medication management, clinical diabetes care, identical services at both homes, all services being included day and night, or a promise that residents can always remain as needs change',
        '- simplified Medicaid/COPES eligibility or acceptance claims, 24/7 public opening hours, Kingsgate as a confirmed parent organization, unverified founder/alternate-name claims, or 21 years operating both homes',
        '',
        'Technical cleanup also removed duplicate metadata and schema, false 200 responses for missing URLs/assets, one-home-only contact/navigation emphasis, automatic background-audio startup, and inaccessible low-contrast treatments. Original photos, both location pages, verified addresses, license numbers, coordinates, and Google profile links were retained.',
      ].join('\n'),
    );

  addText_(form, 'Your name', 'Name of the person completing or coordinating this response.', true);
  addText_(form, 'Your email', 'Used only to follow up about these answers.', true);
  addChoice_(
    form,
    'Your role',
    ['Owner', 'Administrator', 'Care manager', 'Marketing or website contact', 'Other'],
    true,
    true,
  );
  addCheckbox_(
    form,
    'Which homes can you answer for?',
    ['A&D Home Care — Lynnwood', 'Aging with Grace AFH — Everett'],
    true,
    false,
  );
}

function addBusinessFactsSection_(form, home) {
  addPage_(
    form,
    home.name + ' — contact, hours, and capacity',
    home.address + ' · Washington AFH license #' + home.license,
  );

  addText_(
    form,
    home.name + ': primary public phone',
    'Enter the single number families should call first.',
    true,
  );
  addChoice_(
    form,
    home.name + ': should (425) 773-0844 appear on this home’s website and listings?',
    YES_NO_UNSURE,
    true,
    false,
  );

  home.legacyPhones.forEach(function (phone) {
    addChoice_(
      form,
      home.name + ': current status of legacy number ' + phone,
      LEGACY_PHONE_STATUS,
      true,
      false,
    );
  });
  addParagraph_(
    form,
    home.name + ': legacy phone notes',
    'For any forwarding number, state the destination. Explain any number that is wrong, no longer controlled, or needs correction in DSHS/directories. Write “None” if no note is needed.',
    true,
  );

  addParagraph_(
    form,
    home.name + ': exact public-contact hours for every weekday',
    'Example: Monday–Friday 8:00 AM–7:00 PM; Saturday–Sunday 9:00 AM–5:00 PM. These are hours when a prospective family can reach the business, not resident-care coverage.',
    true,
  );
  addChoice_(
    form,
    home.name + ': are calls from prospective families answered by the business 24/7?',
    YES_NO_UNSURE,
    true,
    false,
  );
  addChoice_(
    form,
    home.name + ': is trained caregiving coverage physically present in the home 24/7?',
    YES_NO_UNSURE,
    true,
    false,
  );
  addParagraph_(
    form,
    home.name + ': tour schedule and appointment policy',
    'State the days/times tours are offered and whether every tour requires an appointment.',
    true,
  );
  addText_(
    form,
    home.name + ': current DSHS-approved bed capacity',
    'Enter the approved licensed capacity, not the number of current residents.',
    true,
  );
  addText_(
    form,
    home.name + ': current occupied beds',
    'Enter the current resident count or Unknown. This will not be published unless separately approved.',
    true,
  );
  addParagraph_(
    form,
    home.name + ': current availability that may be published',
    'Enter Available, Waitlist, Full, a room count, or Do not publish.',
    true,
  );
  addParagraph_(
    form,
    home.name + ': who will maintain availability, and how often?',
    'Include the person/role and update frequency. Write “Do not publish availability” if no one can maintain it.',
    true,
  );
}

function addCareMatrixSection_(form, home) {
  addPage_(
    form,
    home.name + ' — care capability matrix',
    'Select one answer for every row. A service should be marked Yes only when it is currently available at this specific home.',
  );

  form.addGridItem()
    .setTitle(home.name + ': current care and service capabilities')
    .setHelpText(
      'Use Conditional when availability depends on assessment, delegation, outside providers, staffing, resident fit, or added cost.',
    )
    .setRows(SERVICE_ROWS)
    .setColumns(SERVICE_COLUMNS)
    .setRequired(true);

  addChoice_(
    form,
    home.name + ': did you mark Conditional or Not sure for any service?',
    ['Yes', 'No'],
    true,
    false,
  );

  addParagraph_(
    form,
    home.name + ': conditions and exact scope for the matrix',
    'Use one line per relevant service: SERVICE — who performs it — assessment/delegation required — staffing or clinical limits — outside-provider involvement — extra charge (yes/no/unknown). Include every Conditional or Not sure answer and any Yes answer that needs qualification. Write “None” only if every row is definite and requires no qualification.',
    true,
  );
  addParagraph_(
    form,
    home.name + ': latest Disclosure of Services document link',
    'Paste a Google Drive link or state that the current public DSHS copy is the latest. Do not upload resident records.',
    false,
  );
}

function addPaymentSection_(form, home) {
  addPage_(
    form,
    home.name + ' — Medicaid and payment',
    'These answers determine what payment information can be stated publicly without misleading families.',
  );

  addChoice_(
    form,
    home.name + ': is the home accepting new Medicaid-funded residents now?',
    MEDICAID_STATUS,
    true,
    false,
  );
  addCheckbox_(
    form,
    home.name + ': accepted programs or payment arrangements',
    [
      'Private pay',
      'Medicaid',
      'Long-term care insurance',
      'Unsure',
    ],
    true,
    true,
  );
  addParagraph_(
    form,
    home.name + ': required private-pay period before Medicaid',
    'State the number of months and any exceptions. Write “None” or “Unknown” when appropriate.',
    true,
  );
  addParagraph_(
    form,
    home.name + ': room-and-board charge or other client responsibility',
    'State the amount/rule if known, or write “Confirm individually.”',
    true,
  );
  addParagraph_(
    form,
    home.name + ': publishable rates, deposits, and care-level add-ons',
    'Include a starting price or range, what it includes, one-time fees, and the date reviewed. Write “Do not publish rates” if preferred.',
    true,
  );
  addText_(
    form,
    home.name + ': who confirms eligibility and payment terms?',
    'Name or role; do not enter private login details.',
    true,
  );
}

function addIdentitySection_(form) {
  addPage_(
    form,
    'Business identity, ownership, and experience',
    'Use the exact names shown on licenses, trade-name records, and permanent exterior signage.',
  );

  addText_(form, 'Legal licensee/entity for A&D Home Care', 'Exact registered legal name.', true);
  addText_(form, 'Legal licensee/entity for Aging with Grace AFH', 'Exact registered legal name.', true);
  addChoice_(
    form,
    'What is the legal or public role of “Kingsgate” or “Kingsgate AFH”?',
    [
      'Registered trade name or DBA',
      'Legal parent entity',
      'Public umbrella brand only',
      'Domain name only',
      'No relationship',
      'Unsure',
    ],
    true,
    true,
  );
  addParagraph_(
    form,
    'Documentation or explanation of the Kingsgate relationship',
    'Paste a Drive link to a registration or explain the relationship. Do not include sensitive tax or identity documents.',
    false,
  );
  addText_(
    form,
    'Exact public-facing umbrella brand, if one should appear above both homes',
    'Write “None” if each licensed home should stand alone.',
    true,
  );
  addChoice_(
    form,
    'Which business or businesses were founded by Gabriela Badet?',
    ['Both homes', 'A&D Home Care only', 'Aging with Grace AFH only', 'Neither', 'Unsure'],
    true,
    false,
  );
  addText_(form, 'Year A&D Home Care began operating under the current owner', 'YYYY or Unknown.', true);
  addText_(form, 'Year Aging with Grace AFH began operating under the current owner', 'YYYY or Unknown.', true);
  addCheckbox_(
    form,
    'What does “21 years” accurately describe?',
    [
      'Senior-care experience',
      'Adult family home ownership',
      'Operating A&D Home Care',
      'Operating Aging with Grace AFH',
      'Another tenure',
      'Unsure',
    ],
    true,
    true,
  );
  addChoice_(
    form,
    'May the site continue naming Gabriela Badet and listing Nursing Assistant Registered (NAR) as her credential?',
    YES_NO_UNSURE,
    true,
    false,
  );
  addChoice_(
    form,
    'Do current caregivers include NARs, CNAs, and home care aides?',
    ['Yes — all three', 'Partially — explain below', 'No', 'Unsure'],
    true,
    false,
  );
  addParagraph_(
    form,
    'Caregiver credential details or corrections',
    'State which credentials are current at each home and any wording that should change.',
    true,
  );
  addParagraph_(
    form,
    'Exact relationship and scope behind “RN available as needed”',
    'State whether the RN is an employee, contractor, delegating nurse, consultant, or another role; identify which homes this covers.',
    true,
  );
  addText_(form, 'Permanent exterior-signage name at the Lynnwood address', 'Exact capitalization and punctuation.', true);
  addText_(form, 'Permanent exterior-signage name at the Everett address', 'Exact capitalization and punctuation.', true);
}

function addContentSection_(form) {
  addPage_(
    form,
    'Optional content for the next SEO phase',
    'These answers are not required to keep the corrected site accurate, but they enable richer location pages and better conversion paths.',
  );

  addParagraph_(
    form,
    'A&D Home Care: location-specific care and daily-life description',
    'Describe staffing approach, daily routine, meals, activities, family communication, mobility/accessibility, and admission process.',
    false,
  );
  addParagraph_(
    form,
    'Aging with Grace AFH: location-specific care and daily-life description',
    'Describe staffing approach, daily routine, meals, activities, family communication, mobility/accessibility, and admission process.',
    false,
  );
  addParagraph_(
    form,
    'Testimonials approved for publication',
    'For each: exact quote, first name or initial, city, and confirmation of written permission. A Drive link is acceptable.',
    false,
  );
  addChoice_(
    form,
    'May approved Google review excerpts be displayed on the website?',
    YES_NO_UNSURE,
    false,
    false,
  );
  addParagraph_(
    form,
    'Process for keeping displayed reviews current',
    'Name the person/role and review cadence.',
    false,
  );
  addText_(
    form,
    'Preferred @kingsgateafh.org email address',
    'Example: hello@kingsgateafh.org. Include the mailbox provider/administrator if known.',
    false,
  );
  addParagraph_(
    form,
    'Inquiry form requirements',
    'Destination email, fields to collect, required/optional fields, consent wording, and notification recipients.',
    false,
  );
  addParagraph_(
    form,
    'New photography links and permissions',
    'For each file: Drive link, home, room/feature, capture date, and confirmation that any identifiable resident has written consent.',
    false,
  );
}

function addAccessSection_(form) {
  addPage_(
    form,
    'Accounts, external records, and final notes',
    'Do not provide passwords. State the account status and use platform invitations when access is required.',
  );

  form.addGridItem()
    .setTitle('Google Business Profile status')
    .setRows(['A&D Home Care', 'Aging with Grace AFH'])
    .setColumns(['Claimed and verified', 'Claimed but not verified', 'Not claimed', 'Unsure'])
    .setRequired(true);
  addText_(
    form,
    'Final Google Business Profile primary category for both homes',
    'Use the exact category Google currently shows, or write Unsure.',
    true,
  );
  addChoice_(
    form,
    'Google Search Console status for kingsgateafh.org',
    ['Verified Domain property', 'URL-prefix property only', 'Not set up', 'Unsure'],
    true,
    false,
  );
  addChoice_(
    form,
    'Bing Webmaster Tools status',
    ['Verified', 'Not set up', 'Unsure'],
    true,
    false,
  );
  addParagraph_(
    form,
    'Cloudflare Pages project details',
    'Project name, production branch, and who can approve/deploy the corrected build. Do not enter credentials.',
    true,
  );
  addParagraph_(
    form,
    'Authorized Washington DSHS contact',
    'Name/role/email of the person who can correct legacy phone numbers and submit updated Disclosure of Services forms.',
    true,
  );
  addChoice_(
    form,
    'May old phone and website records be corrected on reputable directories without creating duplicate listings?',
    YES_NO_UNSURE,
    true,
    false,
  );
  addParagraph_(
    form,
    'Platform invitations or coordination notes',
    'State who will send invitations for Google Business Profile, Search Console, Bing, and Cloudflare.',
    false,
  );
  addText_(
    form,
    'Preferred email address for platform invitations',
    'Enter the Google/account email that should receive invitations. Do not enter a password, MFA code, recovery code, API key, or security answer.',
    true,
  );
  addParagraph_(form, 'Anything else we should know?', 'Include corrections, concerns, or links not covered above.', false);
  addCheckbox_(
    form,
    'Security confirmation',
    ['I did not enter passwords, MFA codes, recovery codes, API keys, or security answers, and I will use platform invitations for access'],
    true,
    false,
  );
}

function addPage_(form, title, helpText) {
  return form.addPageBreakItem().setTitle(title).setHelpText(helpText);
}

function addText_(form, title, helpText, required) {
  return form.addTextItem().setTitle(title).setHelpText(helpText).setRequired(required);
}

function addParagraph_(form, title, helpText, required) {
  return form.addParagraphTextItem().setTitle(title).setHelpText(helpText).setRequired(required);
}

function addChoice_(form, title, values, required, showOther) {
  return form.addMultipleChoiceItem()
    .setTitle(title)
    .setChoiceValues(values)
    .showOtherOption(showOther)
    .setRequired(required);
}

function addCheckbox_(form, title, values, required, showOther) {
  return form.addCheckboxItem()
    .setTitle(title)
    .setChoiceValues(values)
    .showOtherOption(showOther)
    .setRequired(required);
}

function writeLinksSheet_(spreadsheet, form) {
  let name = 'Form links';
  let suffix = 2;

  // Never reuse an existing tab: it may be the form-response destination.
  while (spreadsheet.getSheetByName(name)) {
    name = 'Form links ' + suffix++;
  }

  // Create a separate tab after setDestination() has selected its response tab.
  const sheet = spreadsheet.insertSheet(name, 0);
  sheet.getRange('A1:B5').setValues([
    ['Resource', 'URL'],
    ['Form editor', form.getEditUrl()],
    ['Form for respondents', form.getPublishedUrl()],
    ['Response spreadsheet', spreadsheet.getUrl()],
    ['Source checklist', 'docs/seo-owner-handoff.md in the afh-website repository'],
  ]);
  sheet.getRange('A1:B1').setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 2);
}

function getExistingFiles_() {
  const properties = PropertiesService.getScriptProperties();
  const formId = properties.getProperty(FORM_ID_PROPERTY);
  const sheetId = properties.getProperty(SHEET_ID_PROPERTY);
  if (!formId || !sheetId) return null;

  try {
    return {
      form: FormApp.openById(formId),
      spreadsheet: SpreadsheetApp.openById(sheetId),
    };
  } catch (error) {
    properties.deleteProperty(FORM_ID_PROPERTY);
    properties.deleteProperty(SHEET_ID_PROPERTY);
    return null;
  }
}

function logLinks_(form, spreadsheet) {
  console.log('Form editor: ' + form.getEditUrl());
  console.log('Form for respondents: ' + form.getPublishedUrl());
  console.log('Response spreadsheet: ' + spreadsheet.getUrl());
}

/** Clears only this script's saved IDs so the next run creates a new form. */
function allowCreatingAnotherSeoOwnerForm() {
  PropertiesService.getScriptProperties().deleteAllProperties();
  console.log('Saved IDs cleared. Existing Google files were not deleted.');
}
