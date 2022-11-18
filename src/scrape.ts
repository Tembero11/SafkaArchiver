import axios from "axios";
import assert, { match } from "assert";
import { HTMLElement, parse } from "node-html-parser";
import { ElementUndefinedError, InvalidDateError } from "./errors";
import { Diet, WeekdayId, WeekMenu } from "./types";

const TAI_SAFKA_URL = "https://www.turkuai.fi/turun-ammatti-instituutti/opiskelijalle/ruokailu-ja-ruokalistat/ruokalista-juhannuskukkula-topseli";

const dayList = [
    "mon", "tues", "wed", "thurs", "fri", "sat", "sun"
]

/**
 * 
 * @param pageBody HTML page body
 * @throws { ElementUndefinedError } if any of the elements are not found.
 * @returns Scraped data from the page body
 */
export function parseMenu(page: string) {
    const root = parse(page);

    const dayContainers = root.querySelectorAll("tr");
    assert(dayContainers, new ElementUndefinedError("dayContainers"));
    let fullMenu = [];

    const weekNum = getWeekNumber(root);
    // This might break when the year changes
    const mondayDate = getDateOfISOWeek(weekNum, new Date().getFullYear());

    for (let i = 0; i < 7; i++) {
        const date = addDays(mondayDate, i);
        const dayHTML = dayContainers.at(i);

        if (!dayHTML) {
            fullMenu.push({dayId: dayList[i] as WeekdayId, date, menu: []});
            continue;
        }

        const foodsHTML = dayHTML.getElementsByTagName("td").at(1);
        assert(foodsHTML, new ElementUndefinedError("foodsHTML"));
        const foods = foodsHTML.getElementsByTagName("p").map(e => parseFood(e.innerText)).filter(e => e.name);

        const daysMenu = {
            dayId: dayList[i] as WeekdayId,
            date,
            menu: foods
        }
        fullMenu.push(daysMenu);
    }
    return fullMenu;
}
function getWeekNumber(root: HTMLElement) {
    const meta = root.querySelector("head > meta[name=abstract]");
    assert(meta, new ElementUndefinedError("meta"));

    const content = meta.getAttribute("content");
    assert(content, new Error("\"content\" attribute does not exist on \"content\"."));

    const matches = content.match(/ruokalista vko [0-9]{1,2}/i);
    assert(matches);

    const match = matches.at(0);
    assert(match);

    const num = match.split(" ").at(-1);
    assert(num);

    return parseInt(num);
}

function getDateOfISOWeek(week: number, year: number) {
    var simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

function addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}


/**
 * Sends a GET request
 * @throws 
 * @returns `last-modified` header converted to a date
 * @returns page body
 */
export async function pollMenu() {
    const resp = await axios.get(TAI_SAFKA_URL);

    let lastModified = resp.headers["last-modified"];

    assert(typeof lastModified === "string", new InvalidDateError(lastModified));

    const date = new Date(lastModified);

    assert.notEqual(date, "Invalid Date", new InvalidDateError(lastModified));

    return { currentPage: resp.data, lastModified: new Date(lastModified) };
}

/**
 * 
 * @param foodName Unparsed food name
 * @returns name and diets of the food
 */
function parseFood(foodName: string) {
    const trimmed = foodName.trim();

    let name = trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1);
    const diets: Diet[] = [];

    const match = foodName.match(/\(?(L|G|M| |,){1,}\)?$/);
    if (match) {
        name = name.replace(match[0], "").trim();
        const dietUnparsed = match[0].trim()

        const dietParsed = dietUnparsed.replaceAll(/\(|,| |\.|\)/g, "").split("");

        for (const diet of dietParsed) {
            if (!Object.hasOwn(Diet, diet)) continue;
            diets.push(diet as Diet);
        }
    }

    const result = {
        name,
        diets
    }
    return result;
}