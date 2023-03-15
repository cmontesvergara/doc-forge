import * as pdfKitTemplates from './pdfkit';
const alltemplates = {
  ...pdfKitTemplates,
};

export default function (templateId, payload) {
  return alltemplates[templateId](payload);
}
