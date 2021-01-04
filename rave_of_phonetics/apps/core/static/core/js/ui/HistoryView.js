import {$} from "../utils/dom";

export class HistoryView {
    constructor(whereTheTableShouldBe, whereTheTableActionsShouldBe) {
        this._whereTheTableShouldBe = $(whereTheTableShouldBe)
        this._whereTheFunctionsShouldBe = $(whereTheTableActionsShouldBe)

    }

    async _template(model) {
        const models = await model.toArray()

        if (models.length === 0) {
            this._whereTheFunctionsShouldBe.style.display = 'none'
            return `<p class="center-align">Type and discover the phones of a given word 👌 
                    Your checked words will be available here 👇</p>`
        }

        this._whereTheFunctionsShouldBe.style.display = 'block'

        return `
            <table class="striped highlight responsive-table">
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
        this._whereTheTableShouldBe.innerHTML = await this._template(model)
    }
}
