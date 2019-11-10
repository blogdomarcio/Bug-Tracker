const GoogleSpreadsheet = require('google-spreadsheet')

const credentials = require('./escritacontabilidade.json')

const doc = new GoogleSpreadsheet('1cC7k109rETPwcsm5BozIBeGxzcLJDmplpOUxsZOqIyk')

doc.useServiceAccountAuth(credentials, (err) => {
    if(err){
        console.log('Nao foi possivel abrir a planiha')
    } else {
        console.log('Planilha Aberta')
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({ nome: 'Marcio', email: 'blogdomarcio@Live.com' }, err => {
                console.log('Linha Inserida')
            })
        })
    }
})