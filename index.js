const express = require('express')
const app = express()

const path = require('path')

const bodyParser = require('body-parser')

const { promisify } = require('util')

const sgMail = require('@sendgrid/mail')

const GoogleSpreadsheet = require('google-spreadsheet')

const credentials = require('./escritacontabilidade.json')

// configurações

const docId = '1cC7k109rETPwcsm5BozIBeGxzcLJDmplpOUxsZOqIyk'
const worksheetIndex = 0

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))
app.use(bodyParser.urlencoded({
    extended: true
}))


app.get('/', (request, response) => {
    response.render('home')
})

app.post('/', async (request, response) => {

    try {
        const doc = new GoogleSpreadsheet(docId)

        await promisify(doc.useServiceAccountAuth)(credentials)

        const info = await promisify(doc.getInfo)()

        const worksheet = info.worksheets[worksheetIndex]

        await promisify(worksheet.addRow)({
            nome: request.body.nome,
            email: request.body.email,
            userAgent: request.body.userAgent,
            userDate: request.body.userDate,
            issueType: request.body.issueType,
            source: request.query.source || 'direct'
        })
        // se for critico

        if (request.body.issueType === 'Critico') {
            sgMail.setApiKey(SENDGRID_API_KEY);
            const msg = {   
                to: 'blogdomarcio@live.com',
                from: 'blogdomarcio@live.com',
                subject: 'Bug Critico Repotado',
                text: 'BUG REPORTADO',
                html: '<strong> O ${request.body.nome} reportou um problema </strong>',
            };
            await sgMail.send(msg);
        }
        response.send('Sucesso')

    } catch (err) {
        response.send('Erro ao enviar formulário')
        console.log(err)
    }
})



app.listen(3000, (err) => {
    if (err) {
        console.log('Aconteceu um erro', err)
    } else {
        console.log('Rodando na porta 3000')
    }
})