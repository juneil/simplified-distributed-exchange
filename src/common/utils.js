/**
 * Promisify peer.request
 * 
 * @param {*} peer 
 * @param  {...any} args 
 * @returns Promise<data>
 */
exports.request = function request(peer, ...args) {
    return new Promise((res, rej) => {
        peer.request(...args, (err, data) => {
            if (err) {
                return rej(err);
            }
            return res(data);
        })
    });
}
