import retreiveQuestions from "./modules/fetchPages";
import ArchiverDatabase from "./database/database"
import type { ArchiverOptions } from "./types"

export default class Archiver {

    private _database;
    private _apiKey;
    private _verbose;

    constructor(apiKey: string, options: ArchiverOptions) {
        if (options.dir)
            this._database = new ArchiverDatabase(options.dir);
        this._apiKey = apiKey;
        this._verbose = options.verbose || false;
    }

    async processCategory(categories: string | string[], shouldReturn?: boolean) {

        if (Array.isArray(categories)) {
            const allQuestions = [];

            for (const category of categories) {
                const questions = await retreiveQuestions(this._apiKey, category, this._verbose);

                if (this._database)
                    this._database.pushQuestions(questions)
                if (shouldReturn)
                    allQuestions.push(...questions);
            }
            if (shouldReturn) return allQuestions;

        } else if (typeof categories === "string") {
            const questions = await retreiveQuestions(this._apiKey, categories, this._verbose);

            if (this._database)
                this._database.pushQuestions(questions)

            if (shouldReturn) return questions;
        } else {
            throw Error("Category must be a string or array.")
        }
    }
}