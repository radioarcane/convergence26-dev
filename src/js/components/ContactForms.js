import AWS from 'aws-sdk/global';
import SNS from 'aws-sdk/clients/sns.js';
import { parse } from 'parse-form';

const FORM_CLASS = 'contact-form';
const FORM_PROCESSING_CLASS = 'contact-form--submitting';

const NOTIFICATION_CLASS = 'notification';
const NOTIFICATION_ERROR_CLASS = 'notification--warning';

const AWS_DEFAULT_REGION = 'us-east-1';

const contactFormData = {
   form1: {
      region: AWS_DEFAULT_REGION,
      cognitoIdentityPoolId: '',
      topicArn: '',
      emailSubject: 'Contact Form Submission - Site Name',
      successMsg: 'Thanks for your submission.',
      validatorFn: data => {
         let errors = [];
         return errors;
      },
      afterSuccessFn: (form, props) => {}
   }
};

let formIdentify = {};

const getFormIdentifier = str => {
   const timeStamp = + new Date();
   const rand = Math.ceil(Math.random() * 10000000);

   return `${ str }${ timeStamp }${ rand }`;
};

const getFormNodeProps = node => {
   const formId = node.getAttribute('id');
   const formName = node.getAttribute('name');

   if (contactFormData.hasOwnProperty(formId)) {
      return contactFormData[formId];
   }

   if (contactFormData.hasOwnProperty(formName)) {
      return contactFormData[formName];
   }

   return null;
};

const cleanData = data => {
   let obj = {};

   const trimStr = str => str.toString().trim().replace(/\s{2,}/g, ' ');

   for (const prop in data) {
      const val = data[prop];

      if (Array.isArray(val)) {
         obj[prop] = trimStr(val.join(', '));
         continue;
      }

      obj[prop] = trimStr(val);
   }

   return obj;
};

const buildEmailBody = data => {
   const propToLabel = key => key.replace(/_-/g, ' ').charAt(0).toUpperCase() + key.substr(1);

   let msg = '\n\n';

   for (const prop in data) {
      const label =  propToLabel(prop);
      msg += `${ label }: ${ data[prop].toString() }\n\n`;
   }

   msg += '\n\n';

   return msg;
};

const handleSendEmail = (props, msg) => {
   return new Promise((resolve, reject) => {
      const sns = new SNS();

      const params = {
         Subject: props.subject,
         Message: msg,
         TopicArn: props.topicArn,
      };

      sns.publish(params, (err, data) => {
         if (err) {
            reject([err.message]);
         }
         else {
            resolve(true);
         }
      });
   });
};

const removeNotifications = formNode => {
   const selector = `.${ NOTIFICATION_CLASS }, .${ NOTIFICATION_ERROR_CLASS }`;
   const notifications = formNode.querySelectorAll(selector);
   [...notifications].forEach(node => formNode.removeChild(node));
};

const addNotification = (formNode, content, isError = false) => {
   removeNotifications(formNode);

   const notify = document.createElement('div');

   let notifyClass = NOTIFICATION_CLASS;

   if (isError) {
      notifyClass  += ` ${ NOTIFICATION_ERROR_CLASS }`;
   }

   notify.className = notifyClass;

   if (typeof content === 'string') {
      notify.innerHTML = content;
   }
   else {
      notify.appendChild(content);
   }

   formNode.insertBefore(notify, formNode.childNodes[0]);
};

const handleSuccess = (formNode, props) => {
   if (props.successMsg) {
      addNotification(formNode, props.successMsg);
      return;
   }

   const container = document.createElement('p');
   const text = document.createTextNode(`Thank you for your submission.`);
   container.appendChild(text);

   addNotification(formNode, container);

   if (props.hasOwnProperty('afterSuccessFn') && typeof props.afterSuccessFn === 'function') {
      props.afterSuccessFn(formNode, props);
   }
};

const handleError = (errors, formNode) => {
   const ul = document.createElement('ul');

   errors.forEach(err => {
      const li = document.createElement('li');
      const text = document.createTextNode(err);
      li.appendChild(text);
      ul.appendChild(li);
   });

   addNotification(formNode, ul);
};

const handleSubmit = ev => {
   ev.preventDefault();

   const form = ev.target;
   const formData = cleanData(parse(form).body);
   const props = formIdentify[form.getAttribute('data-id')];

   if (props.hasOwnProperty('validatorFn') && typeof props.validatorFn === 'function') {
      const errs = props.validatorFn(formData);

      if (errs.length) {
         handleError(errs, form);
         return false;
      }
   }

   form.classList.add(FORM_PROCESSING_CLASS);

   handleSendEmail(props.subject, buildEmailBody(formData))
   .then(
      success => handleSuccess(form, props),
      errors => handleError(errors, form)
   );
};

export const setupForm = (node, props) => {
   AWS.config.region = props.region;

   AWS.config.credentials = new AWS.CognitoIdentityCredentials({
       IdentityPoolId: props.cognitoIdentityPoolId,
   });

   AWS.config.credentials.get(() => {
     //console.log("AWS credentials intialized");
   });

   node.addEventListener('submit', handleSubmit);
};

export const setupForms = () => {
   const forms = document.querySelectorAll(`.${ FORM_CLASS }`);

   [...forms].forEach(formNode => {
      const formProps = getFormNodeProps(formNode);

      if (formProps) {
         const id = getFormIdentifier(formProps.topicArn);

         formIdentify[id] = Object.assign({}, {
            id: id,
         }, formProps);

         formNode.setAttribute('data-id', id);
         setupForm(formNode, formProps);
      }
   });
};

export default setupForms;
