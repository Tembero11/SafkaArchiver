import ms from "ms";
import { parseMenu, pollMenu } from "./api"

function setupPoller() {
    pollMenu().then(({currentPage, lastModified}) => {
        const timeUntilNextPoll = (16 * 60 * 1000) - (new Date().getTime() - lastModified.getTime());
        
        console.log("Page will be polled in " + ms(timeUntilNextPoll, { long: true }));

        const menu = parseMenu(currentPage);

        if (!menu) return;

        


        setTimeout(setupPoller,  timeUntilNextPoll);
    });
}
setupPoller();