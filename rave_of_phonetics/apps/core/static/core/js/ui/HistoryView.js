import {$} from "../utils/dom";

export class HistoryView {
    constructor(selector) {
        this._element = $(selector)
    }

    async _template(model) {
        const models = await model.toArray()

        return `
            <table>
                <thead>
                    <tr>
                        <th>Text</th>
                        <th>Language</th>
                        <th>Pitch</th>
                        <th>Rate</th>
                        <th>Created at</th>
                    </tr>
                </thead>
                <tbody>
                    ${models.map(textConfiguration =>
            `
                        <tr data-id="${textConfiguration.id}" class="text-configuration-row">
                            <td>${textConfiguration.text}</td>
                            <td>${textConfiguration.language}</td>
                            <td>${textConfiguration.pitch}</td>
                            <td>${textConfiguration.rate}</td>
                            <td>${textConfiguration.createdAt}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                </tfoot>
            </table>
        `
    }

    async update(model) {
        this._element.innerHTML = await this._template(model)
    }
}
