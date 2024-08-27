---
title: "Validate Console JS Errors with Playwright"
date: "August 25, 2024"
description: "A guide on how to capture and validate console JavaScript errors using Playwright."
---

When testing web applications, ensuring that your code runs without errors is crucial for maintaining a high-quality user experience. Console JavaScript (JS) errors can be a sign of broken functionality, and if left unchecked, they can lead to significant issues. Playwright, a powerful browser automation tool, allows you to automatically detect and validate these errors as part of your testing process.

### Why Validate Console JS Errors?

Validating console JS errors during automated tests offers several benefits:

1. **Early Bug Detection**: Catching JS errors early helps identify bugs before they become critical issues, allowing you to address them before they affect users.
2. **Improved Stability**: Regular error checks ensure your application remains stable across different environments, reducing the risk of unforeseen issues in production.
3. **Better User Experience**: Addressing JS errors prevents potential disruptions in user interactions, ensuring that your users have a seamless experience on your website.

### How to Validate Console JS Errors with Playwright

Playwright makes it easy to track and validate console JS errors. 

### Sample Playwright Log Message

The following is an example of a log message captured by Playwright, demonstrating how console errors are structured:

```json
{
  "_page": {
    "_type": "Page",
    "_guid": "page@mockedPageGuid"
  },
  "_event": {
    "page": {
      "_events": {},
      "_eventsCount": 11,
      "_object": {
        "_type": "Page",
        "_guid": "page@mockedPageGuid"
      }
    },
    "type": "error",
    "text": "embed placeholder [data-vue-embed=\"locations-setup-modal\"] does not exist. embed will not mount unless placeholder(<div data-vue-embed=\"<name of embed>\"></div>) is included in the DOM",
    "args": [
      {
        "_events": {},
        "_eventsCount": 1,
        "_object": {
          "_type": "JSHandle",
          "_guid": "handle@mockedHandleGuid"
        }
      }
    ],
    "location": {
      "url": "https://mockedurl.cloudfront.net/path/to/js/main.js",
      "lineNumber": 123,
      "columnNumber": 456
    }
  }
}
```

Below is a simple implementation to help you get started:

```typescript
import { Page } from 'playwright';

function trackPageJsErrors(page: Page, pageJsErrors: any[]) {
    page.on('console', msg => {
        if (msg.type() === 'error') {
            pageJsErrors.push({
                type: msg.type(),
                text: msg.text(),
                location: msg.location()
            });
        }
    });
}

function getNewJsErrors(pageJsErrors: any[], knownErrorsPath: string, includeList: string[]) {
    const knownErrors = require(knownErrorsPath);

    return pageJsErrors.filter(log => {
        let isExpected = knownErrors.ignoreList.some(issue => new RegExp(issue).test(log.text));
        let isRelevantDomain = includeList.some(domain => log?.location?.url?.includes(domain));

        return isRelevantDomain && !isExpected;
    });
}

// Example usage:
(async () => {
    const page = await browser.newPage();
    const pageJsErrors: any[] = [];

    trackPageJsErrors(page, pageJsErrors);

    await page.goto('https://yourwebsite.com');

    const newJsErrors = getNewJsErrors(pageJsErrors, './knownErrors.json', ['.yourwebsite.com']);

    if (newJsErrors.length > 0) {
        console.error('New JS Errors found:', newJsErrors);
    } else {
        console.log('No new JS errors found.');
    }

    await browser.close();
})();
```

### Quick Explanation of the Code

1. **trackPageJsErrors Function**:
   - This function sets up a listener on the Playwright `page` object to capture and store any console errors. This allows you to collect detailed information about each error, including its type, message text, and location within the code.
   
2. **getNewJsErrors Function**:
   - This function processes the collected errors, filtering out those that are already known or expected. It cross-references the errors against a list of known issues stored in a `knownErrors.json` file and only returns new, unexpected errors.


