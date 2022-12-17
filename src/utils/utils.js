import _ from 'lodash';

const mostRecentRequestManager = class mostRecentRequestManager {
    // This is copied from the ocs-component-lib
    // Simple wrapper class used to manage a JQuery AJAX request when only the result from the most recently
    // sent request should be used.
    //
    // Parameters:
    // `request`: A function that initiates an AJAX request and returns the jqXHR object.
    // `onDone`: A function that will be called when the request succeeds.
    // `onFail`: A function that will be called when the request fails.
    // `onAlways`: A function that will always be called when the request completes.
    //
    // This wrapper class is helpful when:
    // 1. Request A is sent
    // 2. Request B is sent
    // 3. Response from Request B arrives
    // 4. Response from Request A arrives
    // In this case, the order that the reponses arrive are swapped, which is a problem if you rely on receiving
    // them in order.
    #request;
    #onDone;
    #onFail;
    #onAlways;
    #mostRecentRunningRequest = { jqXHR: null, number: 0 };
  
    constructor(request, onDone, onFail, onAlways) {
      this.#request = request;
      this.#onDone = onDone;
      this.#onFail = onFail;
      this.#onAlways = onAlways;
    }
  
    isCurrent(request) {
      // Check if the request that is passed in is the same as the currently running one.
      return request.number === this.#mostRecentRunningRequest.number;
    }
  
    send() {
      // Start a new request.
      let newJqXHR = this.#request();
      let newRequestNumber = this.#mostRecentRunningRequest.number + 1;
      let newRequest = { jqXHR: newJqXHR, number: newRequestNumber };
      this.#mostRecentRunningRequest = _.cloneDeep(newRequest);
      newJqXHR.done((data, textStatus, jqXHR) => {
        if (this.isCurrent(newRequest) && this.#onDone) {
          this.#onDone(data, textStatus, jqXHR);
        }
      });
      newJqXHR.fail((jqXHR, textStatus, errorThrown) => {
        if (this.isCurrent(newRequest) && this.#onFail) {
          this.#onFail(jqXHR, textStatus, errorThrown);
        }
      });
      newJqXHR.always((dataOrJqXHR, textStatus, jqXHROrErrorThrown) => {
        if (this.isCurrent(newRequest) && this.#onAlways) {
          this.#onAlways(dataOrJqXHR, textStatus, jqXHROrErrorThrown);
        }
      });
      return newRequest;
    }
};


export {
    mostRecentRequestManager
};
