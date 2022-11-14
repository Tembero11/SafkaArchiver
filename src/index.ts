import ms from "ms";
import { pollMenu } from "./api"

function setupPoller() {
    pollMenu().then(updateTime => {
        const timeUntilNextPoll = (16 * 60 * 1000) - (new Date().getTime() - updateTime.getTime());
        console.log("Page will be polled in " + ms(timeUntilNextPoll));
        setTimeout(setupPoller,  timeUntilNextPoll);
    });
}
setupPoller();