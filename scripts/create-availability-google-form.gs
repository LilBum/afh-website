const AVAILABILITY_FORM_TITLE = 'Update Room Availability — A&D + Aging with Grace';
const AVAILABILITY_SHEET_TITLE = 'A&D + Aging with Grace — Availability Updates';

const AVAILABILITY_PROPERTIES = {
  formId: 'AVAILABILITY_FORM_ID',
  sheetId: 'AVAILABILITY_SHEET_ID',
  updateCode: 'AVAILABILITY_UPDATE_CODE',
};

const AVAILABILITY_QUESTIONS = {
  code: 'Update authorization code — leave this unchanged',
  home: 'Which home are you updating?',
  status: 'What should the website show?',
  count: 'How many rooms are available?',
  room: 'What type of room is available?',
  bathroom: 'What bathroom arrangement may be advertised?',
  privacy: 'Privacy confirmation',
};

const AVAILABILITY_PRIVACY_CONFIRMATION = 'This update contains no resident or applicant information';

const AVAILABILITY_HOME_LABELS = {
  lynnwood: 'A&D Home Care — Lynnwood',
  everett: 'Aging with Grace AFH — Everett',
};

const AVAILABILITY_STATUS_LABELS = {
  available: 'Available',
  waitlist: 'Waitlist',
  full: 'Full / no openings',
  call: 'Call for current availability',
};

const AVAILABILITY_FORM_CHOICES = {
  counts: ['Not applicable', '1', '2', '3 or more'],
  rooms: ['Not applicable', 'Private bedroom', 'Shared bedroom', 'Call for room details'],
  bathrooms: ['Not applicable', 'Private full bathroom', 'Private half bathroom', 'Shared bathroom', 'Call for bathroom details'],
};

/** Creates the private owner form and linked audit sheet once. */
function createAvailabilityGoogleForm() {
  withAvailabilityLock_(function () {
    const configuration = getAvailabilityWorkflowConfiguration_();
    if (configuration) {
      logAvailabilityLinksForWorkflow_(openAvailabilityWorkflow_(configuration));
      return;
    }

    const workflow = createAvailabilityWorkflow_();
    try {
      saveAvailabilityWorkflow_(workflow);
    } catch (error) {
      closeIncompleteAvailabilityForm_(workflow.form);
      throw error;
    }
    printAvailabilityLinks_(workflow);
  });
}

/** Replaces a lost or exposed owner link without ever activating a half-created workflow. */
function rotateAvailabilityGoogleForm() {
  withAvailabilityLock_(function () {
    const oldForm = openSavedAvailabilityFormForClosure_();
    const replacement = createAvailabilityWorkflow_();

    try {
      saveAvailabilityWorkflow_(replacement);
    } catch (error) {
      closeIncompleteAvailabilityForm_(replacement.form);
      throw error;
    }
    if (oldForm && oldForm.getId() !== replacement.form.getId()) {
      closeReplacedAvailabilityForm_(oldForm);
    }
    printAvailabilityLinks_(replacement);
  });
}

function createAvailabilityWorkflow_() {
  const updateCode = Utilities.getUuid().replace(/-/g, '');
  let form = null;
  let spreadsheet = null;

  try {
    form = FormApp.create(AVAILABILITY_FORM_TITLE, true)
      .setDescription([
        'Use this short form whenever room availability changes at either home.',
        'Submit one update per home. A newer submission replaces the older public status for that home.',
        'Do not enter resident names, diagnoses, contact details, or any other private information.',
        'Available rooms expire after 7 days. Waitlist, full, and owner-confirmed call statuses expire after 30 days.',
      ].join('\n\n'))
      .setCollectEmail(false)
      .setProgressBar(false)
      .setAllowResponseEdits(false)
      .setShowLinkToRespondAgain(false)
      .setPublishingSummary(false)
      .setShuffleQuestions(false)
      .setConfirmationMessage('The website update has been recorded. Submit the bookmarked form again whenever either home changes.');

    const codeValidation = FormApp.createTextValidation()
      .setHelpText('Use the private bookmarked link. If this field changed, reopen the bookmark instead of typing a value.')
      .requireTextMatchesPattern('^' + updateCode + '$')
      .build();
    const codeItem = form.addTextItem()
      .setTitle(AVAILABILITY_QUESTIONS.code)
      .setHelpText('This is filled automatically by the private bookmarked link. Do not change it.')
      .setValidation(codeValidation)
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle(AVAILABILITY_QUESTIONS.home)
      .setChoiceValues([AVAILABILITY_HOME_LABELS.lynnwood, AVAILABILITY_HOME_LABELS.everett])
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle(AVAILABILITY_QUESTIONS.status)
      .setHelpText('Choose Available only when a room is ready to discuss with prospective families now.')
      .setChoiceValues([
        AVAILABILITY_STATUS_LABELS.available,
        AVAILABILITY_STATUS_LABELS.waitlist,
        AVAILABILITY_STATUS_LABELS.full,
        AVAILABILITY_STATUS_LABELS.call,
      ])
      .setRequired(true);

    form.addListItem()
      .setTitle(AVAILABILITY_QUESTIONS.count)
      .setHelpText('Choose Not applicable when the exact count should not be advertised or the status is not Available.')
      .setChoiceValues(AVAILABILITY_FORM_CHOICES.counts)
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle(AVAILABILITY_QUESTIONS.room)
      .setHelpText('Choose Not applicable when the room type should not be advertised or the status is not Available.')
      .setChoiceValues(AVAILABILITY_FORM_CHOICES.rooms)
      .setRequired(true);

    form.addMultipleChoiceItem()
      .setTitle(AVAILABILITY_QUESTIONS.bathroom)
      .setHelpText('Choose Not applicable when the bathroom arrangement should not be advertised or the status is not Available.')
      .setChoiceValues(AVAILABILITY_FORM_CHOICES.bathrooms)
      .setRequired(true);

    form.addCheckboxItem()
      .setTitle(AVAILABILITY_QUESTIONS.privacy)
      .setChoiceValues([AVAILABILITY_PRIVACY_CONFIRMATION])
      .setRequired(true);

    spreadsheet = SpreadsheetApp.create(AVAILABILITY_SHEET_TITLE);
    form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
    form.setAcceptingResponses(true);

    const workflow = { form: form, spreadsheet: spreadsheet, codeItem: codeItem, updateCode: updateCode };
    verifyAvailabilityWorkflow_(workflow);
    writeAvailabilityLinks_(spreadsheet, form, codeItem, updateCode);
    return workflow;
  } catch (error) {
    if (form) closeIncompleteAvailabilityForm_(form);
    const formId = form ? form.getId() : 'not created';
    const sheetId = spreadsheet ? spreadsheet.getId() : 'not created';
    console.error('Availability workflow creation failed. Inactive file IDs: form=' + formId + ', sheet=' + sheetId);
    throw error;
  }
}

/** Returns only the latest safe public state; response history is never exposed. */
function doGet() {
  const payload = buildAvailabilityPayload_();
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Prints and refreshes the private form link and public web-app URL. */
function logAvailabilityLinks() {
  withAvailabilityLock_(function () {
    const configuration = getAvailabilityWorkflowConfiguration_();
    if (!configuration) throw new Error('Run createAvailabilityGoogleForm first.');
    logAvailabilityLinksForWorkflow_(openAvailabilityWorkflow_(configuration));
  });
}

function buildAvailabilityPayload_() {
  const runtime = openAvailabilityRuntime_();
  const generatedAt = new Date();
  const fallback = {
    schemaVersion: 1,
    generatedAt: generatedAt.toISOString(),
    updatedAt: null,
    homes: {
      lynnwood: fallbackAvailability_(),
      everett: fallbackAvailability_(),
    },
  };
  const responses = runtime.form.getResponses();
  let latestTimestamp = null;
  const latestByHome = { lynnwood: null, everett: null };

  responses.forEach(function (response) {
    const answers = responseAnswers_(response);
    if (answers[AVAILABILITY_QUESTIONS.code] !== runtime.updateCode) return;
    if (answers[AVAILABILITY_QUESTIONS.privacy] !== AVAILABILITY_PRIVACY_CONFIRMATION) return;

    const homeKey = homeKeyForLabel_(answers[AVAILABILITY_QUESTIONS.home]);
    const timestamp = response.getTimestamp();
    if (!homeKey || !timestamp) return;
    if (latestByHome[homeKey] && timestamp.getTime() <= latestByHome[homeKey].getTime()) return;

    fallback.homes[homeKey] = availabilityFromResponse_(answers, timestamp, generatedAt);
    latestByHome[homeKey] = timestamp;
    if (!latestTimestamp || timestamp.getTime() > latestTimestamp.getTime()) latestTimestamp = timestamp;
  });

  fallback.updatedAt = latestTimestamp ? latestTimestamp.toISOString() : null;
  return fallback;
}

function availabilityFromResponse_(answers, timestamp, now) {
  const status = statusForLabel_(answers[AVAILABILITY_QUESTIONS.status]);
  if (!status) return fallbackAvailability_();

  const maximumAgeDays = status === 'available' ? 7 : 30;
  const expiresAt = new Date(timestamp.getTime() + maximumAgeDays * 24 * 60 * 60 * 1000);
  if (now.getTime() >= expiresAt.getTime()) return fallbackAvailability_();

  if (status === 'call') {
    return {
      status: status,
      headline: 'Call for current availability',
      detail: 'Availability can change quickly. Please call for the latest information.',
      confirmedAt: timestamp.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
  }

  if (status === 'waitlist') {
    return {
      status: status,
      headline: 'Waitlist',
      detail: 'The home is currently accepting names for its waitlist. Please call to discuss timing and fit.',
      confirmedAt: timestamp.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
  }

  if (status === 'full') {
    return {
      status: status,
      headline: 'Currently full',
      detail: 'There are no current openings. Please call to discuss future availability.',
      confirmedAt: timestamp.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
  }

  return availableRoomFromResponse_(answers, timestamp, expiresAt);
}

function availableRoomFromResponse_(answers, timestamp, expiresAt) {
  const count = answers[AVAILABILITY_QUESTIONS.count];
  const room = answers[AVAILABILITY_QUESTIONS.room];
  const bathroom = answers[AVAILABILITY_QUESTIONS.bathroom];

  if (AVAILABILITY_FORM_CHOICES.counts.indexOf(count) < 0 ||
      AVAILABILITY_FORM_CHOICES.rooms.indexOf(room) < 0 ||
      AVAILABILITY_FORM_CHOICES.bathrooms.indexOf(bathroom) < 0) {
    return fallbackAvailability_();
  }

  const countCopy = {
    'Not applicable': { headline: 'Opening available', sentence: 'A room is currently available' },
    '1': { headline: 'One opening available', sentence: 'One room is currently available' },
    '2': { headline: 'Two openings available', sentence: 'Two rooms are currently available' },
    '3 or more': { headline: 'Three or more openings available', sentence: 'Three or more rooms are currently available' },
  }[count];
  const roomCopy = {
    'Not applicable': '',
    'Private bedroom': ' Private bedroom.',
    'Shared bedroom': ' Shared bedroom.',
    'Call for room details': ' Call for room details.',
  }[room];
  const bathroomCopy = {
    'Not applicable': '',
    'Private full bathroom': ' Private full bathroom.',
    'Private half bathroom': ' Private half bathroom.',
    'Shared bathroom': ' Shared bathroom.',
    'Call for bathroom details': ' Call for bathroom details.',
  }[bathroom];

  if (!countCopy || roomCopy === undefined || bathroomCopy === undefined) return fallbackAvailability_();

  return {
    status: 'available',
    headline: countCopy.headline,
    detail: countCopy.sentence + '.' + roomCopy + bathroomCopy + ' Please call to confirm current availability.',
    confirmedAt: timestamp.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

function fallbackAvailability_() {
  return {
    status: 'call',
    headline: 'Call for current availability',
    detail: 'Availability can change quickly. Please call for the latest information.',
    confirmedAt: null,
    expiresAt: null,
  };
}

function responseAnswers_(response) {
  const answers = {};
  response.getItemResponses().forEach(function (itemResponse) {
    const answer = itemResponse.getResponse();
    answers[itemResponse.getItem().getTitle()] = Array.isArray(answer) ? answer.join(', ') : String(answer);
  });
  return answers;
}

function homeKeyForLabel_(label) {
  if (label === AVAILABILITY_HOME_LABELS.lynnwood) return 'lynnwood';
  if (label === AVAILABILITY_HOME_LABELS.everett) return 'everett';
  return null;
}

function statusForLabel_(label) {
  const keys = Object.keys(AVAILABILITY_STATUS_LABELS);
  for (let i = 0; i < keys.length; i++) {
    if (AVAILABILITY_STATUS_LABELS[keys[i]] === label) return keys[i];
  }
  return null;
}

function withAvailabilityLock_(operation) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return operation();
  } finally {
    lock.releaseLock();
  }
}

function getAvailabilityPropertyValues_() {
  const properties = PropertiesService.getScriptProperties();
  return {
    formId: properties.getProperty(AVAILABILITY_PROPERTIES.formId),
    sheetId: properties.getProperty(AVAILABILITY_PROPERTIES.sheetId),
    updateCode: properties.getProperty(AVAILABILITY_PROPERTIES.updateCode),
  };
}

function getAvailabilityWorkflowConfiguration_() {
  const configuration = getAvailabilityPropertyValues_();
  const populated = [configuration.formId, configuration.sheetId, configuration.updateCode]
    .filter(function (value) { return Boolean(value); }).length;

  if (populated === 0) return null;
  if (populated !== 3) {
    throw new Error('The saved availability setup is incomplete. Run rotateAvailabilityGoogleForm to repair it safely.');
  }

  return configuration;
}

function getAvailabilityRuntimeConfiguration_() {
  const configuration = getAvailabilityPropertyValues_();
  const populated = [configuration.formId, configuration.updateCode]
    .filter(function (value) { return Boolean(value); }).length;

  if (populated === 0) {
    throw new Error('The availability workflow has not been configured.');
  }
  if (populated !== 2) {
    throw new Error('The saved availability runtime configuration is incomplete.');
  }
  if (!/^[a-f0-9]{32}$/i.test(configuration.updateCode)) {
    throw new Error('The saved availability runtime authorization value is invalid.');
  }

  return { formId: configuration.formId, updateCode: configuration.updateCode };
}

function openAvailabilityRuntime_() {
  const configuration = getAvailabilityRuntimeConfiguration_();
  let form;

  try {
    form = FormApp.openById(configuration.formId);
  } catch (error) {
    throw new Error('The saved availability form cannot be opened. Restore it or run rotateAvailabilityGoogleForm.');
  }

  return { form: form, updateCode: configuration.updateCode };
}

function openAvailabilityWorkflow_(configuration) {
  let form;
  let spreadsheet;

  try {
    form = FormApp.openById(configuration.formId);
  } catch (error) {
    throw new Error('The saved availability form cannot be opened. Do not rerun creation; restore it or rotate the workflow.');
  }

  try {
    spreadsheet = SpreadsheetApp.openById(configuration.sheetId);
  } catch (error) {
    throw new Error('The saved availability audit sheet cannot be opened. The public feed can still use the form; restore the sheet or rotate the workflow.');
  }

  const workflow = {
    form: form,
    spreadsheet: spreadsheet,
    codeItem: getAvailabilityTextItem_(form, AVAILABILITY_QUESTIONS.code),
    updateCode: configuration.updateCode,
  };
  verifyAvailabilityWorkflow_(workflow);
  return workflow;
}

function verifyAvailabilityWorkflow_(workflow) {
  if (!/^[a-f0-9]{32}$/i.test(workflow.updateCode)) {
    throw new Error('The saved availability authorization value is invalid.');
  }
  if (workflow.form.getDestinationId() !== workflow.spreadsheet.getId()) {
    throw new Error('The availability form is not linked to the saved audit sheet.');
  }
  if (workflow.form.supportsAdvancedResponderPermissions() && !workflow.form.isPublished()) {
    throw new Error('The availability form is not published.');
  }
  if (!workflow.form.isAcceptingResponses()) {
    throw new Error('The availability form is not accepting responses.');
  }
}

function saveAvailabilityWorkflow_(workflow) {
  PropertiesService.getScriptProperties().setProperties({
    [AVAILABILITY_PROPERTIES.formId]: workflow.form.getId(),
    [AVAILABILITY_PROPERTIES.sheetId]: workflow.spreadsheet.getId(),
    [AVAILABILITY_PROPERTIES.updateCode]: workflow.updateCode,
  });
}

function openSavedAvailabilityFormForClosure_() {
  const formId = getAvailabilityPropertyValues_().formId;
  if (!formId) return null;

  try {
    return FormApp.openById(formId);
  } catch (error) {
    console.warn('The previous availability form could not be opened for closure. Its saved ID will be replaced.');
    return null;
  }
}

function closeReplacedAvailabilityForm_(form) {
  try {
    form.setCustomClosedFormMessage('This availability form has been replaced. Please use the newest private bookmark.');
    form.setAcceptingResponses(false);
  } catch (error) {
    console.warn('The replacement is active, but the previous form could not be closed. Remove responder access manually.');
  }
}

function closeIncompleteAvailabilityForm_(form) {
  try {
    form.setAcceptingResponses(false);
    if (form.supportsAdvancedResponderPermissions() && form.isPublished()) form.setPublished(false);
  } catch (error) {
    console.warn('An incomplete form could not be closed automatically. Use the logged form ID to close it manually.');
  }
}

function getAvailabilityTextItem_(form, title) {
  const items = form.getItems(FormApp.ItemType.TEXT);
  for (let i = 0; i < items.length; i++) {
    if (items[i].getTitle() === title) return items[i].asTextItem();
  }
  throw new Error('The authorization-code field is missing from the form.');
}

function createOwnerAvailabilityUrl_(form, codeItem, updateCode) {
  return form.createResponse()
    .withItemResponse(codeItem.createResponse(updateCode))
    .toPrefilledUrl();
}

function logAvailabilityLinksForWorkflow_(workflow) {
  writeAvailabilityLinks_(workflow.spreadsheet, workflow.form, workflow.codeItem, workflow.updateCode);
  printAvailabilityLinks_(workflow);
}

function printAvailabilityLinks_(workflow) {
  const ownerUrl = createOwnerAvailabilityUrl_(workflow.form, workflow.codeItem, workflow.updateCode);
  const webAppUrl = ScriptApp.getService().getUrl() || 'Deploy as a web app, then run logAvailabilityLinks again';

  console.log('Private owner update form: ' + ownerUrl);
  console.log('Form editor: ' + workflow.form.getEditUrl());
  console.log('Response spreadsheet: ' + workflow.spreadsheet.getUrl());
  console.log('Availability JSON web app: ' + webAppUrl);
}

function writeAvailabilityLinks_(spreadsheet, form, codeItem, updateCode) {
  const sheetName = 'Setup links';
  const existingSheet = spreadsheet.getSheetByName(sheetName);
  const sheet = existingSheet || spreadsheet.insertSheet(sheetName, 0);
  const webAppUrl = ScriptApp.getService().getUrl() || 'Deploy as a web app, then run logAvailabilityLinks again';
  const ownerEmail = Session.getEffectiveUser().getEmail() || 'Record the owning Google account manually';
  const values = [
    ['Resource', 'URL or value'],
    ['Google account that owns the files', ownerEmail],
    ['Private owner update form — bookmark this', createOwnerAvailabilityUrl_(form, codeItem, updateCode)],
    ['Form editor', form.getEditUrl()],
    ['Response spreadsheet', spreadsheet.getUrl()],
    ['Availability JSON web app', webAppUrl],
    ['Routine owner action', 'Open the bookmarked form, submit one update for the home that changed, and close it.'],
  ];

  sheet.getRange(1, 1, values.length, 2).setValues(values);
  sheet.getRange('A1:B1').setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 2);
}
