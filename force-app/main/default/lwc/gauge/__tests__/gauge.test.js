import { createElement } from "lwc";
import Gauge from "c/gauge";
import { registerLdsTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import { getRecord } from "lightning/uiRecordApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";

const mockGetRecord = require("./data/getRecord.json");
const mockGetObjectInfo = require("./data/getObjectInfo.json");

const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
const getObjectInfoAdapter = registerLdsTestWireAdapter(getObjectInfo);

jest.useFakeTimers();

describe("c-gauge", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("Gauge value should be 50%", () => {
    const element = createElement("c-gauge", {
      is: Gauge
    });
    element.inputFieldApiName = "Probability";
    element.objectApiName = "Opportunity";
    element.recordId = "fakeId";

    document.body.appendChild(element);

    getRecordAdapter.emit(mockGetRecord);
    getObjectInfoAdapter.emit(mockGetObjectInfo);

    jest.runAllTimers();

    return Promise.resolve().then(() => {
      let h1 = element.shadowRoot.querySelector(".gauge-data h1");
      expect(h1.textContent).toBe("50%");
    });
  });
});
