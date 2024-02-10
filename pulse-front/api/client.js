/**
 * HOW TO USE DEVELOPMENT SERVER:
 * - in the backend directory, run the server as flask run --host=0.0.0.0
 * - in this directory, in a file called "ip.js", write the following:
 *  export default "http://<your ip address>:5000";
 * Your ip address can be found by running "ipconfig" in the command line and looking for the IPv4 address,
 * or by running the server as described above and using the IP that is not 127.0.0.1
 */

import axios from "axios";
import ip from "./ip";

export default axios.create({
    baseURL: ip,
    headers: {
        "Content-type": "application/json",
    },
    withCredentials: true
});