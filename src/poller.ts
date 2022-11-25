import ms from "ms";
import { EventEmitter } from "node:events";
import { parseMenu, pollMenu } from "./scrape";
import { WeekMenu } from "./types";

interface PollerOptions {
    enableLogs?: boolean
}

declare interface Poller {
    on(event: "polled", listener: (menu: WeekMenu) => void): this;
}

class Poller extends EventEmitter {
    isRunning = false;
    // 16 min in ms
    readonly defaultTime = 16 * 60 * 1000;
    // 3 min in ms
    readonly retryTime = 3 * 60 * 1000;

    enableLogs = true;

    constructor(options?: PollerOptions) {
        super();
        if (options?.enableLogs === false) {
            this.enableLogs = false;
        }
    }

    startPolling() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.poll();
    }
    stopPolling() {
        this.isRunning = false;
    }

    private async poll() {
        if (!this.isRunning) return;

        let pollResult;
        try {
            pollResult = await pollMenu();
        } catch (err) {
            if (this.enableLogs) {
                console.log(err);
                console.log("Page load failed. Retrying in " + ms(this.retryTime, { long: true }));
            }
            setTimeout(() => this.poll.bind(this)(), this.retryTime);
            
            return;
        }

        const { currentPage, lastModified } = pollResult;

        const timeUntilNextPoll = this.getNextPollTime(lastModified);

        if (this.enableLogs) {
            console.log("Page will be polled in " + ms(timeUntilNextPoll, { long: true }));
        }
        
        let menu;
        try {
            menu = parseMenu(currentPage);
        } catch (err) {
            if (this.enableLogs) {
                console.log(err);
                console.log("Page load failed. Retrying in " + ms(this.retryTime, { long: true }));
            }
            console.log(err);
            setTimeout(() => this.poll.bind(this)(), this.retryTime);
            return;
        }

        this.emit("polled", menu);
        
        setTimeout(() => this.poll.bind(this)(),  timeUntilNextPoll);
    }

    getNextPollTime(lastModified: Date) {
        return this.defaultTime - (new Date().getTime() - lastModified.getTime())
    }
}

export default Poller;