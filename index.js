const express = require('express')
const app = express()

const path = require('path')

const bodyParser = require('body-parser')

const { promisify } = require('util')

const sgMail = require('@sendgrid/mail')

const { GoogleSpreadsheet } = require('google-spreadsheet')

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

app.get('/sefaz', (request, response) => {
    response.render('sefaz')
})

app.post('/sefaz', async (request, response) => {

    console.log(request.body.CGC)
    response.send('Sucesso')


})

app.post('/', async (request, response) => {

    try {
        const doc = new GoogleSpreadsheet(docId)

        // await promisify(doc.useServiceAccountAuth)(credentials)

        await doc.useServiceAccountAuth(credentials)

        // const info = await promisify(doc.getInfo)()

        const info = await doc.loadInfo()

        // console.log(info)




        // const worksheet = info.sheetsByIndex[worksheetIndex]

        const sheet = doc.sheetsByIndex[0]

        // console.log(sheet)


        await sheet.addRow({
            nome: request.body.nome,
            email: request.body.email,
            userAgent: request.body.userAgent,
            userDate: request.body.userDate,
            issueType: request.body.issueType,
            erro: request.body.erro,
            saida: request.body.saida,
            recebida: request.body.recebida,
            obs: request.body.obs,
            source: request.query.source || 'direct'
        })
        // se for critico

        // if (request.body.issueType === 'Critico') {
        //     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        //     const msg = {
        //         to: 'blogdomarcio@live.com',
        //         from: 'blogdomarcio@live.com',
        //         subject: 'Bug Critico Repotado',
        //         text: 'BUG REPORTADO',
        //         html: '<strong> O ${request.body.nome} reportou um problema </strong>',
        //     };
        //     await sgMail.send(msg);
        // }
        // response.send('Sucesso')

        response.render('sucesso')

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