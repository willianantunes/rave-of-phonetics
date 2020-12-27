class HistoryView {
    constructor(selector) {
        this._element = $(selector)
    }

    _template(model) {
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
                    ${model.toArray().map(textConfiguration => 
                    `
                        <tr>
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

    update(model) {
        this._element.innerHTML = this._template(model)
    }
}
