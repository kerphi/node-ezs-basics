function BUFObject(data, feed) {
    if (this.isLast()) {
        feed.close();
    } else {
        feed.send(Buffer.from(data));
    }
}

/**
 * Take `Mixed` and produce Buffer.
 * For example, it's useful to send string to browser.
 *
 * @name BUFObject
 * @alias bufferify
 * @param {undefined} none
 * @returns {Buffer}
 */
export default {
    BUFObject,
};
