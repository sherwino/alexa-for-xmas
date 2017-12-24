/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const present = require('./presents');

const APP_ID = "amzn1.ask.skill.cfdf3e2e-8bd3-4840-a5b4-48a47f9ef542"; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            PRESENTS: present.PRESENTS_EN_US,
            SKILL_NAME: 'your christmas presents',
            WELCOME_MESSAGE: "Ho ho ho Merry Christmas, this year Alexa is going to help open %s. You could ask something like, what did Rosy get?",
            WELCOME_REPROMPT: 'Go ahead ask me. I know what you got for Christmas.',
            DISPLAY_CARD_TITLE: '%s  - Presents for %s.',
            HELP_MESSAGE: "You can ask questions such as, you could ask something like, what did Rosy get?, or, you can say exit...You get it bro?",
            HELP_REPROMPT: "Are you slow?",
            STOP_MESSAGE: 'Peace! I\'m out of here',
            PRESENTS_REPEAT_MESSAGE: 'Ok if you want you could ask me to repeat it',
            PRESENTS_NOT_FOUND_MESSAGE: "I\'m sorry, looks like you got a lump of coal this year",
            PRESENTS_NOT_FOUND_WITH_ITEM_NAME: 'you got a %s. ',
            PRESENTS_NOT_FOUND_WITHOUT_ITEM_NAME: '...like it is not even in my list. ',
            PRESENTS_NOT_FOUND_REPROMPT: '...Dude but...I really can\'t find your present, try again or maybe you just didn\'t get anything',
        },
    },
    'en-US': {
        translation: {
            PRESENTS: present.PRESENTS_EN_US,
            SKILL_NAME: 'your christmas presents!',
        },
      }
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'PresentIntent': function () {
        const presentSlot = this.event.request.intent.slots.Present;
        let presentFor;
        if (presentSlot && presentSlot.value) {
            presentFor = presentSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), presentFor);
        const myPRESENTS = this.t('PRESENTS');
        const present = myPRESENTS[presentFor];

        if (present) {
            this.attributes.speechOutput = present;
            this.attributes.repromptSpeech = this.t('PRESENTS_REPEAT_MESSAGE');
            this.emit(':askWithCard', present, this.attributes.repromptSpeech, cardTitle, present);
        } else {
            let speechOutput = this.t('PRESENTS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('PRESENTS_NOT_FOUND_REPROMPT');
            if (presentFor) {
                speechOutput += this.t('PRESENTS_NOT_FOUND_WITH_ITEM_NAME', presentFor);
            } else {
                speechOutput += this.t('PRESENTS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
