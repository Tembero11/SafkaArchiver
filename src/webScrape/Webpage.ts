import parse, { HTMLElement } from "node-html-parser";
import assert from "node:assert";
import objectHash from "object-hash";
import { ElementUndefinedError } from "../errors";
import { DayMenu, WeekMenu } from "../types";
import { addDaysToDate, getDateOfISOWeek, isValidDateString } from "../utils";

export default class Webpage {
    readonly url;
    readonly pageHTML;
    readonly page: HTMLElement;
    constructor(url: string, pageHTML: string) {
        this.url = url;
        this.pageHTML = pageHTML;
        this.page = parse(pageHTML);
    }

    /**
     * 
     * @throws { ElementUndefinedError } if any of the elements are not found.
     * @returns Scraped data from the page body
     */
    parse() {
        const dayContainers = this.page.querySelectorAll("tr");
        assert(dayContainers, new ElementUndefinedError("dayContainers"));
        

        const modifiedTime = this.getModifiedTime();
        const weekNum = this.getWeekNumber();

        const fullMenu: WeekMenu = { modifiedTime, weekNumber: weekNum, days: [] };

        // This might break when the year changes
        const mondayDate = getDateOfISOWeek(weekNum, new Date().getFullYear());

        for (let i = 0; i < 7; i++) {
            const date = addDaysToDate(mondayDate, i);
            const dayHTML = dayContainers.at(i);

            const day: Omit<DayMenu, "hash"> = {
                dayId: i,
                date,
                menu: []   
            }

            // if the html for the day is not found push the empty day to the array
            if (!dayHTML) {
                fullMenu.days.push({hash: null, ...day});
                continue;
            }
            // If not get the foods

            const foodsHTML = dayHTML.getElementsByTagName("td").at(1);
            assert(foodsHTML, new ElementUndefinedError("foodsHTML"));
            const foods = foodsHTML.getElementsByTagName("p").map(e => this.parseFood(e.innerText)).filter(e => e.name);

            // Add all the foods to the day object
            day.menu.push(...foods);

            // Add the day to the week
            fullMenu.days.push({hash: objectHash(day), ...day});
        }
        return fullMenu;
    }


    getModifiedTime() {
        const meta = this.page.querySelector("head > meta[property=article:modified_time]");
        assert(meta, new ElementUndefinedError("meta"));
    
        const content = meta.getAttribute("content");
        assert(content, new Error("\"content\" attribute does not exist on \"meta\"."));
    
        assert(isValidDateString(content));
    
        return new Date(content);
    }

    getWeekNumber() {
        const meta = this.page.querySelector("head > meta[name=abstract]");
        assert(meta, new ElementUndefinedError("meta"));
    
        const content = meta.getAttribute("content");
        assert(content, new Error("\"content\" attribute does not exist on \"meta\"."));
    
        const matches = content.match(/ruokalista vko [0-9]{1,2}/i);
        assert(matches);
    
        const match = matches.at(0);
        assert(match);
    
        const num = match.split(" ").at(-1);
        assert(num);
    
        return parseInt(num);
    }
    /**
     * 
     * @param foodName Unparsed food name
     * @returns name and diets of the food
     */
    private parseFood(foodName: string) {
        const trimmed = foodName.trim();

        let name = trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1);
        
        const result = {
            name,
            isLactoseFree: false,
            isDairyFree: false,
            isGlutenFree: false,
        }

        const match = foodName.match(/\(?(L|G|M|\s|,){1,}\)?$/);
        if (match) {
            name = name.replace(match[0], "").trim();
            const dietUnparsed = match[0].trim()

            const dietParsed = dietUnparsed.replaceAll(/\(|,|\s|\.|\)/g, "").split("");

            for (const diet of dietParsed) {
                switch (diet) {
                    case "L":
                        result.isLactoseFree = true;
                        break;
                    case "M":
                        result.isDairyFree = true;
                        break;
                    case "G":
                        result.isGlutenFree = true;
                        break;
                    default:
                        break;
                }
            }
        }


        // Update the name
        result.name = name;

        return result;
    }
}